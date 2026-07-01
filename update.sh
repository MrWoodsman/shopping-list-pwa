#!/usr/bin/env bash
echo "Pobieram najnowszą wersję z GitHuba..."
cd /opt/shopping-list-pwa

# Wymusza pobranie najnowszej wersji, ignorując lokalne zmiany
git fetch --all
git reset --hard origin/main

# Reszta aktualizacji
echo "Buduję frontend..."
cd frontend && npm install && npm run build && cd ..
echo "Aktualizuję backend..."
cd backend && npm install && cd ..

echo "Restartuję aplikację..."
systemctl restart shopping-app

echo "Aktualizacja zakończona!"