# Peruskuva
FROM python:3.11

# Työhakemisto
WORKDIR /app

# Kopioi riippuvuudet ja asenna ne
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopioi sovellus
COPY . .

# Määritä komento
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
