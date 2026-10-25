$currentDir = (Get-Location).Path
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "       XUAT BAO CAO KTHP DE 4 SANG MICROSOFT WORD (.DOCX)" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan

$scriptPath = Join-Path $currentDir "scripts\generate-formatted-docx.js"
node $scriptPath

Write-Host "`n[HOAN TAT] File Word da duoc cap nhat theo dung chuan mau KTHP!" -ForegroundColor Green
