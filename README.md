# Nexus.mobi

Protótipo de site para bicicletas elétricas, com catálogo de três modelos, identidade visual própria e uma jornada demonstrativa de consulta de preços e test ride.

**Status:** protótipo para apresentação. O formulário valida os campos e simula a confirmação; não transmite dados, não armazena contatos e não agenda visitas. A mensagem de sucesso representa a interface proposta, não um recebimento real pela loja. O apresentador deve esclarecer isso antes de demonstrar o envio. Não utilizar esta versão para captação pública.

## O projeto

- Identidade em areia, azul-petróleo e terracota, com símbolo inspirado em trajetos.
- Fotografias locais e catálogo com V40 Pro, V20 Mini e LAF Comfort.
- Seleção de modelo integrada ao formulário, validação, carregamento e repetição.
- Layout responsivo, navegação por teclado e preferência por movimento reduzido.
- Atalho Windows para abrir a versão de produção local.

A página atual usa fotografias e não carrega modelos 3D. Código legado do visualizador permanece no projeto; seus arquivos de mídia não fazem parte desta publicação.

## Executar

Requisitos: Node.js 20.9 ou superior e npm. Utilize as versões fixadas em `package-lock.json`.

```sh
git clone https://github.com/ThiagoPorto30/projeto-nexusmobi.git
cd projeto-nexusmobi
npm ci
npm run dev
```

Abra [localhost:3000](http://localhost:3000).

### Versão de produção local

```sh
npm run build
npm run start
```

A instalação e a primeira compilação requerem internet, inclusive para obter as fontes Geist. Depois de preparado o build, a página, as fontes e as fotos são servidas localmente. Links para WhatsApp e Instagram continuam dependendo de conexão.

### Atalho Windows

Após instalar e compilar, dê dois cliques em **Abrir apresentação Nexus.cmd**. Ele abre o navegador depois de confirmar que o site está pronto em `http://127.0.0.1:3000`.

O atalho verifica o projeto, o processo e o build antes de reutilizar um servidor. Se outro programa ocupar a porta, ele informa o conflito sem encerrá-lo. Se um novo build tiver sido gerado, encerre o servidor anterior antes de reabrir o atalho. Ele não instala dependências nem executa builds automaticamente.

## Validação

```sh
npm run lint
npm run typecheck
npm run format:check
npm run test:unit
npm run build
npm test
```

No Windows, também execute:

```sh
npm run test:launcher
```

Os testes de navegador usam Microsoft Edge instalado e podem iniciar o servidor de produção automaticamente. Compile antes de executá-los. Para usar outro navegador, ajuste `channel` em `playwright.config.ts`.

A suíte cobre catálogo, fotos, seleção de produto, campos inválidos, foco, confirmação, repetição, menu móvel, teclado, movimento reduzido, auditoria axe e larguras de 360 a 1440 px. O ensaio de apresentação bloqueia acessos externos e verifica fontes, imagens e ausência de envio ou persistência dos dados. Os testes do atalho verificam início, reutilização e conflito de porta. Testes automatizados não substituem avaliação completa com leitores de tela ou aparelhos físicos.

Para gerar capturas locais com o site já aberto na porta 3000:

```sh
npm run capture:presentation
```

As imagens são gravadas em `apresentacao/`, fora do versionamento.

## Organização

| Caminho              | Responsabilidade                              |
| -------------------- | --------------------------------------------- |
| `src/app/`           | Página, layout, estilos e metadados           |
| `src/components/`    | Navegação, catálogo e interface do formulário |
| `src/lib/catalog.ts` | Modelos, especificações, imagens e contatos   |
| `src/lib/leads.ts`   | Validação e simulação de envio                |
| `public/images/`     | Fotografias usadas pela página                |
| `scripts/`           | Abertura local e geração de capturas          |
| `tests/`             | Testes de dados, navegador e lançador         |

Next.js 16, React 19, TypeScript, Tailwind CSS 4 e Lucide. Sem banco de dados, autenticação ou API de recebimento de contatos.

## Conteúdo e fontes

As fotografias e especificações do protótipo foram obtidas das publicações oficiais abaixo. Os números reproduzem informações anunciadas e precisam de confirmação comercial antes da publicação do site. Autonomia depende do trajeto, da carga e das condições de uso. Preços permanecem sob consulta.

| Material            | Fonte                                                                         |
| ------------------- | ----------------------------------------------------------------------------- |
| V40 Pro e V20 Mini  | [Publicação comparativa](https://www.instagram.com/nexus.mobi/p/DbvnPTjqTWG/) |
| LAF Comfort         | [Apresentação do modelo](https://www.instagram.com/nexus.mobi/p/DcgfANxK3-g/) |
| Foto LAF Comfort    | [Publicação oficial](https://www.instagram.com/nexus.mobi/p/DdEoY11KqE3/)     |
| Marca e atendimento | [Instagram Nexus.mobi](https://www.instagram.com/nexus.mobi/)                 |

A presença dos arquivos neste repositório não concede direitos de reutilização de marcas ou fotografias de terceiros.

## Antes de publicar como site operacional

- **LEADS-001:** integrar recebimento real, validação no servidor, limites de abuso e confirmação de recebimento antes de exibir sucesso.
- **CONTENT-001:** aprovar imagens, especificações, disponibilidade, entrega, preços e condições de test ride com a Nexus.
- **RELEASE-001:** definir hospedagem, domínio, privacidade, retenção de dados, responsáveis, monitoramento e reversão. Remover `noindex` somente depois das validações.

Backups, materiais comerciais de apresentação, relatórios locais, instruções da estação de trabalho e o acervo 3D anterior permanecem fora do Git. Este repositório contém o projeto do protótipo; publicar seu código não significa implantar o site.
