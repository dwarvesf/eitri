import { ColorResolvable, CommandInteraction, User } from "discord.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { embedsColors, SlashCommand } from "types/common"
import { composeEmbedMessage } from "utils/discordEmbed"
import { SlashCommandBuilder } from "@discordjs/builders"
import { slashCommands } from "commands"
import { buildHelpInterface } from "./help"
import { BOT_NAME_DISPLAY } from "utils/constants"
dayjs.extend(utc)

const image =
  "https://cdn.discordapp.com/attachments/984660970624409630/1023869479521882193/help2.png"

function getHelpEmbed(user: User) {
  return composeEmbedMessage({
    author: [`${BOT_NAME_DISPLAY} Commands`],
    image,
    footer: [user?.tag, user.avatarURL()],
  })
}

const command: SlashCommand = {
  name: "help",
  category: "Profile",
  prepare: (slashCommands) => {
    const choices = Object.keys(slashCommands ?? {})
      .filter((c) => c !== "help")
      .map((c) => [`/${c}`, c]) as [string, string][]
    return new SlashCommandBuilder()
      .setName("help")
      .setDescription("Help Menu")
      .addStringOption((option) =>
        option
          .setName("command")
          .setDescription("Command to provide details about.")
          .setRequired(false)
          .setChoices(choices)
      )
  },
  run: async function (interaction: CommandInteraction) {
    const command = interaction.options.getString("command")
    const messageOptions = await (slashCommands[command ?? ""] ?? this).help(
      interaction
    )
    return { messageOptions }
  },
  help: async (interaction) => {
    const embed = getHelpEmbed(interaction.user)
    buildHelpInterface(embed, "/")

    embed.addFields({
      name: "**Examples**",
      value: `\`\`\`/help\`\`\``,
    })

    embed.setColor(embedsColors.Game as ColorResolvable)
    return {
      embeds: [embed],
    }
  },
  colorType: "Command",
}

export default command
