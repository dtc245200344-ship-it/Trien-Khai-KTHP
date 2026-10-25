try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $filePath = 'd:\Triển Khai KTHP\BAO_CAO_KTHP_DE_4.docx'
    $doc = $word.Documents.Open($filePath, $false, $true)
    Write-Output ("SUCCESS! Paragraphs: " + $doc.Paragraphs.Count)
    $doc.Close()
    $word.Quit()
} catch {
    Write-Output ("FAILED: " + $_.Exception.Message)
    if ($word) { $word.Quit() }
}
