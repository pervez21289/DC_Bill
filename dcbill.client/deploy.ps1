# deploy.ps1
# Script to build React app (Vite) and deploy to network share

# Set variables
$ProjectPath = "C:\Projects\DC_Bill\dcbill.client"
$DistFolder = "$ProjectPath\dist"
$DeployPath = "\\WIN-SO5DALTE35E\nexbillinvoice\wwwroot"

# Display start message
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting React App Deployment (Vite)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Write-Host "Step 1: Navigating to project directory..." -ForegroundColor Yellow
Set-Location -Path $ProjectPath
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Clean previous build (optional)
Write-Host "Step 2: Cleaning previous build (if exists)..." -ForegroundColor Yellow
if (Test-Path $DistFolder) {
    Write-Host "Removing existing dist folder..." -ForegroundColor Yellow
    Remove-Item -Path $DistFolder -Recurse -Force
    Write-Host "Dist folder removed." -ForegroundColor Green
} else {
    Write-Host "No existing dist folder found." -ForegroundColor Green
}
Write-Host ""

# Build the React application
Write-Host "Step 3: Building React application..." -ForegroundColor Yellow
Write-Host "Running: npm run build" -ForegroundColor Gray
$buildProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run build" -Wait -PassThru -NoNewWindow

if ($buildProcess.ExitCode -eq 0) {
    Write-Host "Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed with exit code: $($buildProcess.ExitCode)" -ForegroundColor Red
    Write-Host "Deployment aborted." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Verify dist folder exists
Write-Host "Step 4: Verifying dist folder..." -ForegroundColor Yellow
if (Test-Path $DistFolder) {
    Write-Host "Dist folder found at: $DistFolder" -ForegroundColor Green
    # Show contents
    Write-Host "Dist folder contents:" -ForegroundColor Gray
    Get-ChildItem -Path $DistFolder | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
} else {
    Write-Host "Dist folder not found!" -ForegroundColor Red
    Write-Host "Deployment aborted." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if deploy path is accessible
Write-Host "Step 5: Checking deployment path..." -ForegroundColor Yellow
if (Test-Path $DeployPath) {
    Write-Host "Deployment path is accessible: $DeployPath" -ForegroundColor Green
} else {
    Write-Host "Deployment path is NOT accessible!" -ForegroundColor Red
    Write-Host "Please check network connectivity and permissions." -ForegroundColor Red
    Write-Host "Deployment aborted." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Clean deploy folder (optional)
Write-Host "Step 6: Cleaning deployment folder..." -ForegroundColor Yellow
Write-Host "Do you want to clean the deployment folder before copying? (y/n)" -ForegroundColor Yellow
$cleanChoice = Read-Host

if ($cleanChoice -eq 'y' -or $cleanChoice -eq 'Y') {
    Write-Host "Cleaning deployment folder: $DeployPath" -ForegroundColor Yellow
    Remove-Item -Path "$DeployPath\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Deployment folder cleaned." -ForegroundColor Green
} else {
    Write-Host "Skipping cleanup. Existing files will be overwritten." -ForegroundColor Gray
}
Write-Host ""

# Copy dist files to deployment path
Write-Host "Step 7: Copying dist files to deployment path..." -ForegroundColor Yellow
Write-Host "Copying from: $DistFolder" -ForegroundColor Gray
Write-Host "Copying to: $DeployPath" -ForegroundColor Gray

try {
    Copy-Item -Path "$DistFolder\*" -Destination $DeployPath -Recurse -Force
    Write-Host "Files copied successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error copying files: $_" -ForegroundColor Red
    Write-Host "Deployment aborted." -ForegroundColor Red
    exit 1
}
Write-Host ""

# List deployed files (optional)
Write-Host "Step 8: Deployment summary..." -ForegroundColor Yellow
$fileCount = (Get-ChildItem -Path $DeployPath -File -Recurse).Count
Write-Host "Total files deployed: $fileCount" -ForegroundColor Green
Write-Host ""

# Display completion message
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment completed successfully!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Application deployed to: $DeployPath" -ForegroundColor White
Write-Host "Deployment time: $(Get-Date)" -ForegroundColor White
Write-Host ""