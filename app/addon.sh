#!/usr/bin/with-contenv bashio
CONFIG_PATH=/data/options.json
ENV_FILE="/usr/src/app/.env"

# Extract user configuration from Home Assistant add-on options
INTERVAL=$(jq -r '.interval' $CONFIG_PATH)
CAMERAS=$(jq -c '.cameras' $CONFIG_PATH)

# Write environment variables to .env
cat > "$ENV_FILE" <<EOF
INTERVAL=$INTERVAL
CAMERAS='$CAMERAS'
EOF

echo "🚀 Starting camera-snapshot..."
node index.js
