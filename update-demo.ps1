# Refresh Capital Companions demo from GitHub (no git required)
$ErrorActionPreference = "Stop"
$destParent = "C:\Users\Alexis"
$folder = Join-Path $destParent "digital-twin-demo"
$zip = Join-Path $destParent "digital-twin-demo.zip"
$extract = Join-Path $destParent "digital-twin-demo-main"
$uri = "https://github.com/gtownshend1982-eng/digital-twin-demo/archive/refs/heads/main.zip"
Write-Host "Downloading latest demo..."
Invoke-WebRequest -Uri $uri -OutFile $zip
if (Test-Path $extract) { Remove-Item $extract -Recurse -Force }
Expand-Archive -Path $zip -DestinationPath $destParent -Force
if (Test-Path $folder) { Remove-Item $folder -Recurse -Force }
Rename-Item $extract "digital-twin-demo"
Remove-Item $zip -Force
Write-Host "Updated: $folder"
Start-Process (Join-Path $folder "index.html")
