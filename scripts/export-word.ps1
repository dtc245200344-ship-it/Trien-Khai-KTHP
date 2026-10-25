$currentDir = (Get-Location).Path
$OutputFile = Join-Path $currentDir "BAO_CAO_KTHP_DE_4.docx"

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "       XUAT BAO CAO KTHP DE 4 SANG MICROSOFT WORD (.DOCX)" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan

$scriptPath = Join-Path $currentDir "scripts\build-word-doc.js"
$output = node $scriptPath
$tempDir = ($output | Select-String "TEMP_DIR:(.*)").Matches.Groups[1].Value

if (-not $tempDir -or -not (Test-Path $tempDir)) {
    Write-Host "[X] Loi: Khong tim thay thu muc OpenXML!" -ForegroundColor Red
    exit 1
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$tempZip = Join-Path $env:TEMP "temp_doc_$(Get-Random).zip"
if (Test-Path $tempZip) { Remove-Item $tempZip -Force }

# Kiem tra file goc co dang bi Word khoa hay khong
$destPath = $OutputFile
try {
    if (Test-Path $destPath) {
        $stream = [System.IO.File]::Open($destPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
        $stream.Close()
        Remove-Item $destPath -Force
    }
} catch {
    $destPath = Join-Path $currentDir "BAO_CAO_KTHP_DE_4_CapNhat.docx"
    Write-Host "[!] File goc dang mo trong Word, se luu vao file: $destPath" -ForegroundColor Yellow
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $tempZip)

$sourceZip = [System.IO.Compression.ZipFile]::OpenRead($tempZip)
$destFile = [System.IO.File]::Create($destPath)
$destZip = New-Object System.IO.Compression.ZipArchive($destFile, [System.IO.Compression.ZipArchiveMode]::Create)

foreach ($entry in $sourceZip.Entries) {
    $normalizedName = $entry.FullName.Replace('\', '/')
    $newEntry = $destZip.CreateEntry($normalizedName, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $newStream = $newEntry.Open()
    $entryStream.CopyTo($newStream)
    $newStream.Dispose()
    $entryStream.Dispose()
}

$destZip.Dispose()
$destFile.Dispose()
$sourceZip.Dispose()

Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "[OK] Da tao thanh cong file Word tai: $destPath" -ForegroundColor Green
Get-Item $destPath | Select-Object Name, Length, LastWriteTime
