ARG BUILD_FROM
FROM $BUILD_FROM

WORKDIR /usr/src/app

# Install Node.js 22.x via NodeSource
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates gnupg jq \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy files
COPY . ./

# Install deps
RUN npm install

# Make script executable
RUN chmod +x addon.sh

CMD [ "/addon.sh" ]
