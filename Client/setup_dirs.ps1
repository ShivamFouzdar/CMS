# Create all necessary directories
$directories = @(
    "src\components\ui",
    "src\components\layout",
    "src\components\sections",
    "src\components\forms",
    "src\pages",
    "src\lib",
    "src\constants",
    "src\hooks",
    "src\assets\images",
    "src\assets\icons",
    "src\styles",
    "src\types"
)

foreach ($dir in $directories) {
    if (-not (Test-Path -Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir"
    } else {
        Write-Host "Directory already exists: $dir"
    }
}

Write-Host "\nProject structure created successfully!" -ForegroundColor Green
