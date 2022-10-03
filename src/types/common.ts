import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders"
import {
  ColorResolvable,
  CommandInteraction,
  Message,
  MessageOptions,
} from "discord.js"

// Category of commands
export type Category = "Profile" | "Defi" | "Config" | "Community" | "Game"
export type ColorType =
  | "Profile"
  | "Server"
  | "Marketplace" // for sales bot commands
  | "Market" // for showing NFT market-data commands
  | "Defi"
  | "Command"
  | "Game"

export const embedsColors: Record<string, string> = {}

export type SlashCommandChoiceOption = {
  name: string
  description: string
  required: boolean
  choices: [string, string][]
}

export type SlashCommand = {
  name: string
  category: Category
  prepare: (
    slashCommands?: Record<string, SlashCommand>
  ) =>
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandBuilder
  run: (interaction: CommandInteraction) => Promise<
    | {
        messageOptions: MessageOptions
      }
    | void
    | null
    | undefined
  >
  help: (interaction: CommandInteraction) => Promise<MessageOptions>
  ephemeral?: boolean
  colorType: ColorType
}

export type Command = {
  id: string
  command: string
  category: Category
  brief: string
  featured?: {
    title: string
    description: string
  }
  onlyAdministrator?: boolean
  run: (
    msg: Message,
    action?: string,
    isAdmin?: boolean
  ) => Promise<
    | {
        messageOptions: MessageOptions
      }
    | void
    | null
    | undefined
  >
  getHelpMessage: (
    msg: Message,
    action?: string,
    isAdmin?: boolean
  ) => Promise<MessageOptions>
  aliases?: string[]
  canRunWithoutAction?: boolean
  // can only run in admin channels & won't be shown in `$help` message
  experimental?: boolean
  actions?: Record<string, Command>
  allowDM?: boolean
  colorType: ColorType
  minArguments?: number
}

export type EmbedProperties = {
  description?: string
  thumbnail?: string | null
  color?: string | ColorResolvable
  footer?: (string | null)[]
  timestamp?: Date | null
  image?: string
  author?: Array<string | null | undefined>
  usage?: string
  examples?: string
  withoutFooter?: boolean
  includeCommandsList?: boolean
  actions?: Record<string, Command>
  document?: string
}
