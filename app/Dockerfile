ARG BUILD_FROM
FROM $BUILD_FROM

WORKDIR /usr/src/app

# Install Node.js 22.x via NodeSource
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs jq \
    && rm -rf /var/lib/apt/lists/*

# Copy files
COPY . ./

# Install deps
RUN npm install

# Copy startup script and set permissions
COPY addon.sh /addon.sh
RUN chmod +x /addon.sh

# Set command to run
CMD [ "/addon.sh" ]
