#!/usr/bin/env bash
echo "Aktualizuję aplikację..."
cd /opt/shopping-list-pwa
git pull origin main
cd frontend && npm install && npm run build && cd ..
cd backend && npm install
systemctl restart shopping-app
echo "Gotowe! Apka zaktualizowana."