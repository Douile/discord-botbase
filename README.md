# discord-gamestatus

**WIP** discord bot, providing game server status embeds at regular intervals

[Invite link](https://discordapp.com/oauth2/authorize?client_id=659050996730822665&permissions=8&scope=bot)

## Command s
_At the moment there is no help command_

| Command | Usage | Permissions | Comments |
| ------- | ----- | ----------- | -------- |
| gamelist | `!gamelist [game]` | ADMINISTRATOR | View/Search the list of games available
| notify | `!notify [user]` | None | (Only in channel with status message) Get PM notifications when provided user connect/disconnects. Omit user to get notifications when the server changes map or goes offline/online.
| status | `!status {game} {ip}` | ADMINISTRATOR | Add a status message to current channel
| statusclear | `!statusclear` | ADMINISTRATOR | Clear all status messages from current channel

## Configuring
You will need to set the env option `DISCORD_API_KEY` to your discord bot token for the bot to run

### Running as service on debian (or other systemd linux)

In order to run on debian I find it easy to run as a service. Steps to setup are as follows.

1. Create a start script that contains this (Make sure to put your discord API key in)
```bash
#!/bin/sh
export DISCORD_API_KEY=""
node ./index.js
```
2. Allow yourself to run the script `chmod +x start.sh` (or other script filename)
3. (you will need root for this) Create a service in `/etc/systemd/service/discord-gamestatus.service` (Make sure to replace SCRIPT_LOCATION, USER and CODE_LOCATION with the actual locations)
```
[Unit]
Description=Discord GameStatus Bot
After=network.target
StartLimitBurst=5
StartLimitIntervalSec=5
[Service]
Type=simple
Restart=always
RestartSec=2
User=USER
WorkingDirectory=CODE_LOCATION
ExecStart=SCRIPT_LOCATION
[Install]
WantedBy=multi-user.target
```
4. You can now start the bot with `sudo systemctl start discord-gamestatus`, to enable the bot on restart use `sudo systemctl enable discord-gamestatus`. To check the status use `systemctl status discord-gamestatus` or for a live log use `journalctl -f -u discord-gamestatus`.
