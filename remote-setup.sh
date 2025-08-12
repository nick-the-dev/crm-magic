#!/bin/bash
cd /var/app
git clone https://github.com/nick-the-dev/crm-magic.git
cd crm-magic/telegram-remote-control
yarn install
yarn build
echo "Bot built successfully!"
ls -la dist/