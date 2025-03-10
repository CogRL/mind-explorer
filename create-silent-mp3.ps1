# PowerShell script to create silent MP3 files
# These are minimal MP3 files with just headers - they'll play silence

# List of sound files needed
$soundFiles = @(
    "click", 
    "transition", 
    "complete", 
    "intelligence", 
    "creativity", 
    "personality",
    "correct", 
    "incorrect", 
    "timeout"
)

# Simple silent MP3 header bytes (creates a minimal valid MP3 file with silence)
$silentMP3 = [byte[]]@(
    0xFF, 0xFB, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
)

# Create each sound file
foreach ($sound in $soundFiles) {
    $filePath = "sounds/$sound.mp3"
    Write-Host "Creating $filePath"
    [System.IO.File]::WriteAllBytes($filePath, $silentMP3)
}

Write-Host "All silent MP3 files created successfully!"
