$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5500
$url = "http://localhost:$port/index.html"

Write-Host "Starting local preview server at $url"
Start-Process $url
py -m http.server $port --directory $projectRoot
