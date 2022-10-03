import {
  User,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectMenuOptions,
} from "discord.js"
import { VERTICAL_BAR } from "./constants"
import {
  getEmoji,
  getCommandsList,
  msgColors,
  getEmojiURL,
  emojis,
} from "./common"
import { EmbedProperties } from "types/common"

export const EMPTY_FIELD = {
  name: "\u200B",
  value: "\u200B",
  inline: true,
}

/**
 * Returns a formatted string of options (maximum 8)
 *
 * @param {string[]} options Array of option strings
 *
 * @return {string} Formatted string
 * */
export function composeSimpleSelection(
  options: string[],
  customRender?: (o: string, i: number) => string
): string {
  return `${options
    .slice(0, 8)
    .map((o, i) =>
      customRender
        ? customRender(o, i)
        : `${getEmoji(`num_${i + 1}`)} ${VERTICAL_BAR} ${o}`
    )
    .join("\n")}`
}

export function composeDiscordSelectionRow(
  options: MessageSelectMenuOptions = {}
): MessageActionRow {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu(options)
  )

  return row
}

export function composeEmbedMessage(props: EmbedProperties) {
  let { description = "" } = props
  const {
    thumbnail,
    footer: _footer = [],
    image,
    author: _author = [],
    withoutFooter,
    includeCommandsList,
    actions,
  } = props
  const author = _author.map((a) => a ?? "").filter(Boolean)
  const footer = _footer.filter(Boolean) as Array<string>

  if (includeCommandsList) {
    description += `\n\n${getCommandsList(
      getEmoji("reply" ?? "╰ "),
      actions ?? {}
    )}`
  }

  const embed = new MessageEmbed({
    ...(!withoutFooter
      ? {
          footer: {
            text: footer[0],
            iconURL: footer[1],
          },
        }
      : {}),
    ...(author.length > 0
      ? author.length === 1
        ? {
            author: { name: author[0] },
          }
        : { author: { name: author[0], iconURL: author[1] } }
      : {}),
  })

  if (description) embed.setDescription(description)
  if (thumbnail) embed.setThumbnail(thumbnail)
  if (image) embed.setImage(image)

  embed.setTimestamp()
  return embed
}

export function getSuccessEmbed(params: {
  title?: string
  description?: string
  thumbnail?: string
  image?: string
}) {
  const { title, description, thumbnail, image } = params
  return composeEmbedMessage({
    author: [title ?? "Successful", getEmojiURL(emojis["APPROVE"])],
    description: description ?? "The operation finished successfully",
    image,
    thumbnail,
    color: msgColors.SUCCESS,
  })
}

export function getErrorEmbed(params: {
  title?: string
  description?: string
  thumbnail?: string
  image?: string
  originalMsgAuthor?: User
}) {
  const { title, description, thumbnail, image } = params
  return composeEmbedMessage({
    author: [title ?? "Error", getEmojiURL(emojis["REVOKE"])],
    description:
      description ??
      "There was an error. Our team has been informed and is trying to fix the issue. Stay tuned.",
    image,
    thumbnail,
    color: msgColors.ERROR,
  })
}
