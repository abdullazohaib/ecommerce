Add-Type -AssemblyName System.Drawing
$inPath = "public\banners\classic-glow-hero.jpg"
$outPath = "public\banners\classic-glow-hero-clean.jpg"
$src = [System.Drawing.Image]::FromFile((Get-Item $inPath).FullName)
$cropH = $src.Height - 32
$bmp = New-Object System.Drawing.Bitmap $src.Width, $cropH
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$srcRect = New-Object System.Drawing.Rectangle 0, 0, $src.Width, $cropH
$destRect = New-Object System.Drawing.Rectangle 0, 0, $src.Width, $cropH
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save((Resolve-Path .).Path + "\" + $outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()
$src.Dispose()
Write-Output "Clean crop successful!"

