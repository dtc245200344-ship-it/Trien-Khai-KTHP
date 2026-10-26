Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = "C:\Users\MSI\.gemini\antigravity\brain\ca917c38-0e72-4290-a1c4-17d4c74ec4c0\scratch\crm_docx_build"
$tempZip = "C:\Users\MSI\AppData\Local\Temp\real_docx_test.docx"

if (Test-Path $tempZip) { Remove-Item $tempZip -Force }

[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $tempZip, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Write-Output ("Created file size: " + (Get-Item $tempZip).Length)

