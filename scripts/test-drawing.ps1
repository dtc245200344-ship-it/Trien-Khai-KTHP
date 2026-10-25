Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 100, 100
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Blue)
$g.FillRectangle($brush, 10, 10, 80, 80)
$bmp.Save('d:\Triển Khai KTHP\scripts\test_drawing.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output (Test-Path 'd:\Triển Khai KTHP\scripts\test_drawing.png')
