# Eitri Bot

## First time project setup

- Create your own Discord Application -> Discord Bot -> Install it to your dev server
- Install pkg needed for canvas if needed: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`
- Set the env:

```
ENV='dev'

# Your Discord Bot token
DISCORD_TOKEN='...'

# A log channel id in your dev server
LOG_CHANNEL_ID='...'

WEBSITE_ENDPOINT=''

# Your server id
GUILD_ID='...'

# Point to prod BE
API_SERVER_HOST=""

```

## Run project

Run postgres

```
docker-compose up -d
```

Change .env-sample file to .env, fill some required secrets

Install packages

```
make install
```

Run bot

```
make start
```

Run bot in dev mode (incremental build on file changes)

```
make dev
```

If you are developing locally & have the API pointed to the BE prod, make sure you comment out this line in the `messageCreate.ts` file:

```
await handleNormalMessage(message)
```

## Project components

```
        Discord                API
    ---------------          -------
    |             |             |
======================================
[commands] <-> [events]     [handlers]
    |             |             |
    └---------------------------┘
                  |
              [modules]

```

- commands: handle !neko commands on discord
- events: handle discord events
- modules: core objects used by components above
