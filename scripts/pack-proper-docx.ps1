Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = "C:\Users\MSI\.gemini\antigravity\brain\ca917c38-0e72-4290-a1c4-17d4c74ec4c0\scratch\crm_docx_build"
$tempZip = "C:\Users\MSI\AppData\Local\Temp\intermediate_$(Get-Random).zip"
$finalDocx = "C:\Users\MSI\AppData\Local\Temp\proper_docx_test.docx"

if (Test-Path $tempZip) { Remove-Item $tempZip -Force }
if (Test-Path $finalDocx) { Remove-Item $finalDocx -Force }

# 1. Zip from directory
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $tempZip, [System.IO.Compression.CompressionLevel]::Optimal, $false)

# 2. Re-pack with forward slashes
$sourceArchive = [System.IO.Compression.ZipFile]::OpenRead($tempZip)
$targetStream = [System.IO.File]::Create($finalDocx)
$targetArchive = New-Object System.IO.Compression.ZipArchive($targetStream, [System.IO.Compression.ZipArchiveMode]::Create)

foreach ($entry in $sourceArchive.Entries) {
    $forwardSlashName = $entry.FullName.Replace('\', '/')
    $newEntry = $targetArchive.CreateEntry($forwardSlashName, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $newStream = $newEntry.Open()
    $entryStream.CopyTo($newStream)
    $newStream.Dispose()
    $entryStream.Dispose()
}

$targetArchive.Dispose()
$targetStream.Dispose()
$sourceArchive.Dispose()

Remove-Item $tempZip -Force -ErrorAction SilentlyContinue

Write-Output ("Created proper docx size: " + (Get-Item $finalDocx).Length)
