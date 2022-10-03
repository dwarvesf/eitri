import { slashCommands } from "commands"
import { DiscordEvent } from "."
import { getErrorEmbed } from "utils/discordEmbed"
import { wrapError } from "utils/wrapError"
import { CommandInteraction } from "discord.js"

const event: DiscordEvent<"interactionCreate"> = {
  name: "interactionCreate",
  once: false,
  execute: async (interaction) => {
    wrapError(interaction, async () => {
      if (
        !interaction.isSelectMenu() &&
        !interaction.isButton() &&
        !interaction.isCommand()
      )
        return
      if (interaction.isSelectMenu()) {
        await handleSelecMenuInteraction()
      } else if (interaction.isButton()) {
        await handleButtonInteraction()
      } else if (interaction.isCommand()) {
        await handleCommandInteraction(interaction)
      }
    })
  },
}

export default event

async function handleCommandInteraction(i: CommandInteraction) {
  const command = slashCommands[i.commandName]
  if (!command) {
    await i.reply({ embeds: [getErrorEmbed({})] })
    return
  }
  await i.deferReply({ ephemeral: command?.ephemeral })
  const response = await command.run(i)
  if (!response) return
  const { messageOptions } = response
  await i
    .editReply({
      ...messageOptions,
    })
    .catch(() => null)
}

async function handleSelecMenuInteraction() {
  return
}

async function handleButtonInteraction() {
  return
}
