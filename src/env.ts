import dotenv from "dotenv"
dotenv.config()

export const PROD = process.env.NODE_ENV === "production"
export const TEST = process.env.NODE_ENV === "test"
export const DISCORD_TOKEN =
  process.env.DISCORD_TOKEN || "discord-token-not-set"
export const APPLICATION_ID = process.env.APPLICATION_ID || "app-id-not-set"
export const PORT = Number(process.env.PORT || "5001")

export const API_SERVER_HOST =
  process.env.API_SERVER_HOST || "http://localhost:8200"

export const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID || "log-id-not-set"
export const ALERT_CHANNEL_ID =
  process.env.ALERT_CHANNEL_ID || "alert-id-not-set"
export const GUILD_ID = process.env.GUILD_ID || "guild-id-not-set"
