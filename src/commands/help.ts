import { Message, MessageEmbed, User } from "discord.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { capFirst, getEmoji } from "utils/common"
import { Command } from "types/common"
import { composeEmbedMessage } from "utils/discordEmbed"
dayjs.extend(utc)

function getHelpEmbed(user: User) {
  return composeEmbedMessage({
    author: ["Eitri Bot Commands"],
    footer: [user.tag, user.avatarURL()],
  })
}

const commands: Record<
  string,
  {
    emoji: string
    description: string
    features: Array<{
      value: string
      onlySlash?: boolean
      url: string
    }>
  }
> = {}

export function buildHelpInterface(
  embed: MessageEmbed,
  version: "$" | "/" = "$"
) {
  Object.entries(commands)
    .filter((c) => {
      if (version === "$") {
        const [, cmdData] = c
        // if viewing text version but only slash available then exclude it out
        if (cmdData.features.every((f) => f.onlySlash)) return false
      }
      return true
    })
    .forEach((cmd) => {
      const [cmdName, cmdData] = cmd
      embed.addFields({
        name: `${cmdData.emoji} ${capFirst(cmdName)}`,
        value: `${cmdData.features
          .map((f) => {
            return `[\`${version}${f.value}\`](${f.url})`
          })
          .join(" ")}\n${cmdData.description}`,
        inline: true,
      })
    })
}

const command: Command = {
  id: "help",
  command: "help",
  category: "Profile",
  brief: "Help Menu",
  run: async function (msg: Message) {
    const data = await this.getHelpMessage(msg)
    return { messageOptions: data }
  },
  getHelpMessage: async (msg: Message) => {
    const embed = getHelpEmbed(msg.author)
    buildHelpInterface(embed)
    embed.addFields(
      {
        name: "\u200b",
        value: getEmoji("blank"),
        inline: true,
      },
      {
        name: "**Examples**",
        value: `\`\`\`$help\`\`\``,
      }
    )

    return { embeds: [embed] }
  },
  allowDM: true,
  colorType: "Game",
}

export default command
