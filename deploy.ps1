# deploy.ps1

# --- ASETUKSET & MUUTTUJAT ---
$PROJECT_ID = gcloud config get-value project
$REGION = "europe-north1"
$REPO_NAME = "app-images"
$SERVICE_NAME = "electricity-backend"
$IMAGE_NAME = "electricity-backend"
$TAG = "latest"
$FRONTEND_URL = "https://electricity-data-viewer.christaeloranta.fi"

$SA_EMAIL = "backend-identity@$PROJECT_ID.iam.gserviceaccount.com"
$ORIGINS = "$FRONTEND_URL,http://localhost:5173"

$IMAGE_FULL_PATH = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/${IMAGE_NAME}:$TAG"

Write-Host "--------------------------------" -ForegroundColor Yellow
Write-Host "TARKISTETAAN MUUTTUJAT:"
Write-Host "1. Project ID:  '$PROJECT_ID'"
Write-Host "2. Image Name:  '$IMAGE_NAME'"
Write-Host "3. Full Path:   '$IMAGE_FULL_PATH'"
Write-Host "4. Frontend URL: '$FRONTEND_URL'"
Write-Host "--------------------------------" -ForegroundColor Yellow

# --- 1. BUILD ---
Write-Host "1/2 Rakennetaan $IMAGE_NAME..." -ForegroundColor Cyan

if (!(Test-Path "backend")) {
    Write-Error "VIRHE: Aja skripti projektin juuresta (C:\Personal\electricity_data_viewer)."
    exit 1
}

cd backend
gcloud builds submit --tag $IMAGE_FULL_PATH .
cd ..

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build epäonnistui."
    exit 1
}

# --- 2. DEPLOY ---
Write-Host "2/2 Julkaistaan $SERVICE_NAME..." -ForegroundColor Cyan

gcloud run deploy $SERVICE_NAME `
    --image $IMAGE_FULL_PATH `
    --region $REGION `
    --service-account $SA_EMAIL `
    --allow-unauthenticated `
    --port 8080 `
    --set-env-vars "^++^ORIGINS=$ORIGINS" `
    --update-secrets=SQLALCHEMY_DATABASE_URL=db_url:latest

Write-Host "Valmis! Palvelu on päivitetty." -ForegroundColor Green
