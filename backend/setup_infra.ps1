# setup_infra.ps1
# Tarkoitus: Aja tämä vain KERRAN projektin alussa.

$PROJECT_ID = gcloud config get-value project
$REGION = "europe-north1"
$REPO_NAME = "app-images"

Write-Host "🔧 1. Aktivoidaan API:t..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com

Write-Host "📦 2. Luodaan Artifact Registry (Docker-varasto)..."
# Luodaan yksi varasto nimeltä 'app-images', johon mahtuu kaikki (front, back, worker)
gcloud artifacts repositories create $REPO_NAME `
    --repository-format=docker `
    --location=$REGION `
    --description="Central Docker repository for all services"

Write-Host "👤 3. Luodaan Service Account..."
gcloud iam service-accounts create backend-identity --display-name="Backend Identity"

Write-Host "✅ Infra valmis!"