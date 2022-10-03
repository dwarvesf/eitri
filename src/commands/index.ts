// text commands
import help from "./help"

// slash commands
import help_slash from "./help_slash"

// external
import { Message } from "discord.js"

// internal
import { logger } from "../logger"
import {
  getActionCommand,
  getAllAliases,
  getCommandMetadata,
  specificHelpCommand,
  getCommandArguments,
} from "utils/commands"
import { Command, Category, SlashCommand } from "types/common"
import { hasAdministrator } from "utils/common"
import { HELP } from "utils/constants"
import CacheManager from "utils/CacheManager"
import usage_stats from "adapters/usage_stats"
import { isAcceptableCmdToHelp } from "./index-utils"
import FuzzySet from "fuzzyset"

CacheManager.init({ pool: "vote", ttl: 0, checkperiod: 300 })

export const slashCommands: Record<string, SlashCommand> = {
  help: help_slash,
}

export const originalCommands: Record<string, Command> = {
  // general help
  help,
}

export const commands = getAllAliases(originalCommands)
export const fuzzySet = FuzzySet(Object.keys(commands))
export const adminCategories: Record<Category, boolean> = {
  Profile: false,
  Defi: false,
  Community: false,
  Config: true,
  Game: false,
}

/**
 * Check if command is allowed in DM or need specific permissions to run
 */
async function preauthorizeCommand(message: Message, commandObject: Command) {
  if (!commandObject) {
    return
  }
  const isDM = message.channel.type === "DM"
  const actionObject = getActionCommand(commands, message)
  const executingObj = actionObject ?? commandObject
  if (isDM && executingObj.allowDM) return
  const isAdminMember = message.member && hasAdministrator(message.member)
  if (!isDM && (!executingObj.onlyAdministrator || isAdminMember)) return
}

/**
 * Check minimum number of arguments and command can run without action
 * If not then reply with help message
 */
function validateCommand(
  cmd: Command,
  args: string[],
  isActionCommand: boolean,
  isSpecificHelpCommand: boolean
) {
  if (isSpecificHelpCommand) return true
  let valid = cmd.canRunWithoutAction || isActionCommand
  valid = valid && args.length >= (cmd.minArguments ?? 0)
  return valid
}

async function executeCommand(
  message: Message,
  commandObject: Command,
  action: string,
  isSpecificHelpCommand?: boolean
) {
  await message.channel.sendTyping()
  if (isSpecificHelpCommand) {
    const helpMessage = await commandObject.getHelpMessage(message, action)
    if (helpMessage) {
      await message.reply(helpMessage)
      // send command to server to store
      usage_stats.createUsageStat({
        guild_id: message.guildId !== null ? message.guildId : "DM",
        user_id: message.author.id,
        command: "help",
        args: message.content,
      })
    }
    return
  }

  // execute command in `commands`
  const runResponse = await commandObject.run(message, action)
  if (runResponse && runResponse.messageOptions) {
    await message.reply({
      ...runResponse.messageOptions,
    })
  }
  // send command to server to store
  usage_stats.createUsageStat({
    guild_id: message.guildId !== null ? message.guildId : "DM",
    user_id: message.author.id,
    command: commandObject.id,
    args: message.content,
  })
}

export default async function handlePrefixedCommand(message: Message) {
  const args = getCommandArguments(message)
  logger.info(
    `[${message.guild?.name ?? "DM"}][${
      message.author.username
    }] executing command: ${args}`
  )

  let isSpecificHelpCommand = specificHelpCommand(message)
  const { commandKey, action = "" } = getCommandMetadata(commands, message)

  if (!commandKey) return

  // handle custom commands
  // await handleCustomCommands(message, commandKey)

  const commandObject = commands[commandKey]
  // handle default commands
  await preauthorizeCommand(message, commandObject)

  const actions = getAllAliases(commandObject.actions)
  const actionObject = actions[action]
  const finalCmd = actionObject ?? commandObject

  const shouldShowHelp = isAcceptableCmdToHelp(
    commandObject.command,
    commandObject.aliases ?? [],
    actionObject?.command ?? "",
    message.content
  )
  const valid = validateCommand(
    finalCmd,
    args,
    !!actionObject,
    isSpecificHelpCommand ?? false
  )
  if (shouldShowHelp && !valid) {
    message.content = `${HELP} ${commandKey} ${action}`.trimEnd()
    isSpecificHelpCommand = true
  }

  await executeCommand(
    message,
    finalCmd,
    action,
    isSpecificHelpCommand ?? false
  )
}
