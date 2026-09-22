param(
    [ValidateRange(1024, 65535)][int]$Port = 3000,
    [switch]$NoBrowser
)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$nextCli = Join-Path $projectRoot 'node_modules\next\dist\bin\next'
$buildFile = Join-Path $projectRoot '.next\BUILD_ID'
$outputDir = Join-Path $projectRoot 'artifacts'
$url = "http://127.0.0.1:$Port"
$startedProcess = $null

function Get-Listener {
    $listeners = @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
    # Refuse wildcard and IPv6 listeners too: never start over another service.
    return @($listeners | Select-Object -ExpandProperty OwningProcess -Unique)
}

function Test-ProjectProcess([int]$ProcessId) {
    $processInfo = Get-CimInstance Win32_Process -Filter "ProcessId=$ProcessId" -ErrorAction SilentlyContinue
    if (-not $processInfo -or -not $processInfo.CommandLine) { return $false }
    # The full quoted CLI path binds the listener to this checkout, not its title.
    $cliPattern = '(?:^|\s)"?' + [regex]::Escape($nextCli) + '"?(?:\s|$)'
    return ($processInfo.CommandLine -match $cliPattern -and
        $processInfo.CommandLine -match '\sstart\s' -and
        $processInfo.CommandLine -match ('--port\s+' + $Port + '(?:\s|$)') -and
        $processInfo.CommandLine -match '--hostname\s+127\.0\.0\.1(?:\s|$)')
}

try {
    if (-not (Test-Path -LiteralPath $buildFile)) {
        throw 'BUILD AUSENTE. Prepare esta copia com npm run build antes da apresentacao. O atalho nao instala nem compila dependencias.'
    }
    if (-not (Test-Path -LiteralPath $nextCli)) {
        throw 'DEPENDENCIAS AUSENTES. Use a pasta original preparada para a apresentacao.'
    }
    $nodePath = (Get-Command node.exe -ErrorAction Stop).Source
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    $stateFile = Join-Path $outputDir "presentation-$Port.json"
    $buildId = (Get-Content -LiteralPath $buildFile -Raw).Trim()
    $owners = @(Get-Listener)
    $reused = $owners.Count -gt 0
    if ($reused) {
        if ($owners.Count -ne 1 -or -not (Test-ProjectProcess $owners[0])) {
            throw "PORTA OCUPADA ($Port). Outro programa ou servidor nao identificado esta usando esta porta. Nada foi encerrado. Feche esse programa ou use outra porta com -Port."
        }
        if (-not (Test-Path -LiteralPath $stateFile)) {
            throw 'SERVIDOR SEM REGISTRO. Encerre o servidor anterior e abra novamente este atalho.'
        }
        $state = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
        $ownerInfo = Get-CimInstance Win32_Process -Filter "ProcessId=$($owners[0])"
        if ($state.pid -ne $owners[0] -or $state.buildId -ne $buildId -or
            $state.startedAt -ne $ownerInfo.CreationDate.ToUniversalTime().ToString('o')) {
            throw 'SERVIDOR DESATUALIZADO. Encerre o servidor anterior antes de abrir o novo build.'
        }
    } else {
        # Detach with explicit handles so the presentation does not keep the launcher open.
        $serverId = & $nodePath (Join-Path $PSScriptRoot 'start-presentation-server.mjs') "$Port"
        if ($LASTEXITCODE -ne 0 -or "$serverId" -notmatch '^\d+$') { throw 'Nao foi possivel iniciar o servidor.' }
        $startedProcess = Get-Process -Id ([int]$serverId)
    }
    $ready = $false
    $deadline = [DateTime]::UtcNow.AddSeconds(45)
    while ([DateTime]::UtcNow -lt $deadline) {
        if ($startedProcess) {
            $startedProcess.Refresh()
            if ($startedProcess.HasExited) { throw 'O servidor nao iniciou. Consulte o arquivo presentation-PORTA-error.log na pasta artifacts.' }
        }
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
            if ($response.StatusCode -eq 200 -and $response.Content -match '<title>nexus\.mobi') {
                $currentOwners = @(Get-Listener)
                if ($currentOwners.Count -eq 1 -and (Test-ProjectProcess $currentOwners[0])) {
                    if ($startedProcess -and $currentOwners[0] -ne $startedProcess.Id) { throw 'A porta mudou de proprietario durante a abertura.' }
                    $ready = $true
                    break
                }
            }
        } catch { }
        Start-Sleep -Milliseconds 350
    }
    if (-not $ready) { throw 'O site nao respondeu em 45 segundos. Consulte os registros na pasta artifacts e tente novamente.' }
    if ($startedProcess) {
        $ownerInfo = Get-CimInstance Win32_Process -Filter "ProcessId=$($startedProcess.Id)"
        @{ pid = $startedProcess.Id; buildId = $buildId; project = $projectRoot;
           startedAt = $ownerInfo.CreationDate.ToUniversalTime().ToString('o'); url = $url } |
            ConvertTo-Json | Set-Content -LiteralPath $stateFile -Encoding UTF8
    }
    if ($reused) { Write-Host "REUTILIZADO: apresentacao Nexus pronta em $url" }
    else { Write-Host "PRONTO: apresentacao Nexus em $url" }
    if (-not $NoBrowser) { Start-Process $url }
    exit 0
} catch {
    # Only clean up the process this invocation created; never kill a port owner.
    if ($startedProcess) {
        $startedProcess.Refresh()
        if (-not $startedProcess.HasExited) { Stop-Process -Id $startedProcess.Id -ErrorAction SilentlyContinue }
    }
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
