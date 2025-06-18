# serverless-discord-bot

Create Discord Bots Serverlessly via Cloudflare Workers

> [!IMPORTANT]
> Some knowledge about Cloudflare Workers and Discord Bot API will go a LONG way

## Why?

Discords Bots traditionally use a Monolith architecture, meaning you have to host your bot running on a server 24/7. This can cost a lot of money for for most people. [Cloudflare Workers](https://workers.cloudflare.com/) allows you to run your bot without managing a server and only pay for what you use. By default they provide 100,000 requests per day for free, which is more than enough for 99% of people.

## Features

- **⚡ Serverless**: No need to manage servers, deploy your bot on Cloudflare Workers.
- **🛠️ Easy Setup**: Simple configuration to start development
- **🚀 Easy to Expand**: Can be adapted for your needs

## Is this right for my bot?

If you answer yes to all of these questions, this is the right choice for you:

- [ ] Does your bot handle mainly short lived requests?
- [ ] Does your bot not need to maintain a persistent connection to Discord (e.g. for voice)?

## Getting Started

1. Create a new repository using this template.
2. Create a [Cloudflare](https://dash.cloudflare.com/login?redirect_uri=https%3A%2F%2Fdash.cloudflare.com%2F%3Faccount%3Dworkers) account if you don't have one already.
3. Install using your preferred package manager
   Examples:

```bash
# NPM
npm install
# PNPM
pnpm install
# Yarn
yarn install
```

4. Head to the [Workers Page](https://dash.cloudflare.com/?account=workers) in the Cloudflare Dashboard and find your Account ID, then set the `account_id` in the `wrangler.jsonc` file to it
   ![Workers and Account ID Locations in Cloudflare Dashboard](https://github.com/user-attachments/assets/fcae2eab-0d3b-4ac2-bfd9-d9fd3815a8ff)
5. Create a new Discord Application and Bot via the [Discord Developer Portal](https://discord.com/developers/applications)
   ![New Application button found in top right corner of Discord Developer Portal Applications section](https://github.com/user-attachments/assets/8a74108a-e83b-4ba3-912a-a35504afbde2)
6. Copy the Bot Token, Application ID, and Discord Public Key and add it to the `.dev.vars` file (you will also need to add these to the Cloudflare Dashboard later)
   ![Location of Application ID and Discord Public Key in Discord Developer Portal](https://github.com/user-attachments/assets/52d80660-b97c-4045-9bb5-10894645912a)
   ![Location of Bot Token in Discord Developer Portal](https://github.com/user-attachments/assets/3ea176fd-4e0f-4e6e-b443-bc71522a12da)
7. Run the `cf-typegen` command in the `package.json` file
8. Invite the bot to your server using the OAuth2 URL Generator in the Discord Developer Portal. Select bot, application.commands, Send Messages, Use Slash Commands, Read Message History, and any other commands you may need
   ![The OAuth2 Screen in the Discord Developer Portal](https://github.com/user-attachments/assets/9a93b0d5-16f5-459d-ab4e-c471a6165898)
9. Run the `register` command in the `package.json` file
10. When ready to deploy, run the deploy command, and afterwards make sure to add the secrets you specified in `.dev.vars` via your package manager:

```bash
# NPM
npx wrangler secret put <KEY> <VALUE>
# PNPM
pnpm exec wrangler secret put <KEY> <VALUE>
# Yarn
yarn run wrangler secret put <KEY> <VALUE>
```

11. Once deployed, copy the workers.dev link and add it to the `Interactions Endpoint URL` found in the Bot's `General Information` tab in the Discord Developer Portal

## How it works

The `commands.ts` and `register.ts` files are responsible for registering the bot commands onto Discord. When registering them, the slash commands will appear, but they won't work if your bot isn't deployed. They aren't deployed onto Cloudflare Workers. The index.ts will remain more or less the same. All it does is validate the incoming request, and make sure it's a real request from a legitimate user. The handler is where you can handle commands.
