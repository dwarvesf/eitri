import { API_SERVER_HOST } from "env"

export const DOT = "•"
export const COMMA = ","
export const SPACE = " "
export const SPACES_REGEX = / +/g
export const EMPTY = ""
export const VERTICAL_BAR = "|"

export const PREFIX = "$"
export const SLASH_PREFIX = "/"
export const HELP = "help"
export const HELP_CMD = `${PREFIX}${HELP}`

export const API_BASE_URL = `${API_SERVER_HOST}/api/v1`

export const VALID_BOOST_MESSAGE_TYPES = [
  "USER_PREMIUM_GUILD_SUBSCRIPTION",
  "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1",
  "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2",
  "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3",
]

export const ROLE_PREFIX = "<@&"
export const CHANNEL_PREFIX = "<#"
export const USER_PREFIX = "<@"
export const EMOJI_PREFIX = "<:"
export const BOT_NAME_DISPLAY = "Eitri Bot"
export const HOME_PAGE_URL = "https://d.foundation"
