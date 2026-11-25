$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectPath = Split-Path $PSScriptRoot -Parent
$imagePath = Join-Path $projectPath 'public/images'
$outputPath = Join-Path $imagePath 'optimized'
New-Item -ItemType Directory -Path $outputPath -Force | Out-Null
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$manifest = @{}
$imageFiles = @(Get-ChildItem -LiteralPath $imagePath -Recurse -File | Where-Object {
    $_.Extension -in '.jpg', '.jpeg', '.png', '.webp' -and
    $_.FullName.Substring($imagePath.Length + 1) -notmatch '^(optimized|Logos|projects)[\\/]'
})
$imageFiles | ForEach-Object {
    $source = [System.Drawing.Image]::FromFile($_.FullName)
    try {
        $capturedAt = $null
        if ($source.PropertyIdList -contains 36867) {
            $capturedAt = [System.Text.Encoding]::ASCII.GetString($source.GetPropertyItem(36867).Value).Trim([char]0)
            try { $capturedAt = [DateTime]::ParseExact($capturedAt, 'yyyy:MM:dd HH:mm:ss', [Globalization.CultureInfo]::InvariantCulture).ToString('yyyy-MM-ddTHH:mm:ss') } catch { $capturedAt = $null }
        }
        if ($source.PropertyIdList -contains 274) {
            $orientation = [BitConverter]::ToUInt16($source.GetPropertyItem(274).Value, 0)
            $rotation = @{ 2 = 'RotateNoneFlipX'; 3 = 'Rotate180FlipNone'; 4 = 'Rotate180FlipX'; 5 = 'Rotate90FlipX'; 6 = 'Rotate90FlipNone'; 7 = 'Rotate270FlipX'; 8 = 'Rotate270FlipNone' }
            if ($rotation.ContainsKey([int]$orientation)) { $source.RotateFlip([System.Drawing.RotateFlipType]::$($rotation[[int]$orientation])) }
        }
        $relativeName = $_.FullName.Substring($imagePath.Length + 1).Replace('\', '/')
        $stem = ($relativeName -replace '\.[^.]+$', '').ToLowerInvariant() -replace '[^a-z0-9]+', '-'
        $variants = @()
        foreach ($width in @(640, 1280, 1920)) {
            if ($width -gt $source.Width -and $variants.Count -gt 0) { continue }
            $targetWidth = [Math]::Min($width, $source.Width)
            $height = [int][Math]::Round($source.Height * $targetWidth / $source.Width)
            $bitmap = New-Object System.Drawing.Bitmap($targetWidth, $height)
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            try {
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.DrawImage($source, 0, 0, $targetWidth, $height)
                $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
                $fileName = "$stem-$targetWidth.jpg"
                $bitmap.Save((Join-Path $outputPath $fileName), $encoder, $parameters)
                $variants += @{ src = "/images/optimized/$fileName"; width = $targetWidth }
                $parameters.Dispose()
            } finally { $graphics.Dispose(); $bitmap.Dispose() }
        }
        $manifest["/images/$relativeName"] = @{ width = $source.Width; height = $source.Height; capturedAt = $capturedAt; variants = $variants }
    } finally { $source.Dispose() }
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $projectPath 'src/data/images.json')
Write-Output "Optimized $($manifest.Count) original images; originals preserved."
