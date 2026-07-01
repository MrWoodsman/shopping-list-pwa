#!/usr/bin/env bash
# Skrypt instalacyjny dla Twojej apki

echo "Przygotowywanie systemu..."
apt-get update && apt-get install -y nodejs npm git

# Instalacja zależności w backendzie i froncie
echo "Instalacja zależności..."
cd /opt/shopping-list-pwa/frontend && npm install && npm run build
cd ../backend && npm install

# Tworzenie usługi systemowej (żeby działało w tle)
echo "Tworzenie usługi systemowej..."
cat <<EOF > /etc/systemd/system/shopping-app.service
[Unit]
Description=Shopping List PWA
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/shopping-list-pwa/backend
ExecStart=/usr/bin/node index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now shopping-app.service

# Tworzy komendę 'shopping-logs', która otwiera logi
echo "alias shopping-logs='journalctl -u shopping-app -f'" >> /root/.bashrc

echo "--------------------------------------------------------"
echo "Instalacja zakończona pomyślnie!"
echo "Twoja aplikacja działa jako usługa: shopping-app"
echo ""
echo "Przydatne komendy:"
echo " - Status:   systemctl status shopping-app"
echo " - Logi:     journalctl -u shopping-app -f"
echo " - Restart:  systemctl restart shopping-app"
echo "--------------------------------------------------------"

echo "Gotowe! Apka działa pod adresem IP kontenera na porcie 3000."