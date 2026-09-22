@echo off
title Apresentacao Nexus
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\open-presentation.ps1"
if errorlevel 1 pause
