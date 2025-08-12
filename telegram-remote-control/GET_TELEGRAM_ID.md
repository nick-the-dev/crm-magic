# How to Get Your Telegram User ID

To add yourself as a user in the bot's database, you need your Telegram user ID (not username).

## Method 1: Use the Bot (Recommended)
1. Start the bot (it's already running)
2. Send `/start` to your bot in Telegram
3. Check the bot logs - it will show your user ID

## Method 2: Use IDBot
1. Search for `@userinfobot` in Telegram
2. Start a chat with it
3. It will reply with your user ID

## Method 3: Use Raw Updates Bot
1. Search for `@RawDataBot` in Telegram
2. Start a chat with it
3. It will show your user info including ID

## Adding Your User to Database

Once you have your Telegram ID, run:

```bash
# Replace 123456789 with your actual Telegram ID
# Replace YourSecurePassword with your desired password
yarn add-user 123456789 "rise_agggainstt" "YourSecurePassword"
```

## Example with a test password:
```bash
# This is just an example - use your real ID and a secure password
yarn add-user 123456789 "rise_agggainstt" "MySecurePass123!"
```

## After Adding User
1. Open Telegram
2. Find your bot
3. Send `/start`
4. Enter your password when prompted
5. You'll be authenticated for 30 days
6. Try `/tasks` to create Monday.com tasks!