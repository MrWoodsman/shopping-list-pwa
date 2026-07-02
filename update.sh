#!/usr/bin/env bash
# Ustawiamy bazową ścieżkę
BASE_DIR="/opt/shopping-list-pwa"

echo "Pobieram najnowszą wersję z GitHuba..."
cd $BASE_DIR
git fetch --all
git reset --hard origin/main

echo "Buduję frontend..."
cd $BASE_DIR/frontend
npm install
npm run build

echo "Aktualizuję backend..."
cd $BASE_DIR/backend
npm install

echo "Restartuję aplikację..."
systemctl restart shopping-app

echo "Aktualizacja zakończona!"