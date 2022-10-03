import {
  GuildEmoji,
  ColorResolvable,
  Permissions,
  GuildMember,
} from "discord.js"

import type { Command } from "types/common"
import { DOT, HOME_PAGE_URL } from "./constants"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

export const emojis: { [key: string]: string } = {
  GOOD_MORNING: "967285238306840576",
  REVOKE: "967285238055174195",
  REPLY: "967285237983875122",
  PROFILE: "967285238394925086",
  DEFI: "933281365586227210",
  BLANK: "967287119448014868",
  PREV_PAGE: "967285237958705162",
  NEXT_PAGE: "967285238000676895",
  SPARKLE: "984824963112513607",
  ENERGY: "984876653090070658",
  STAR: "984895650623811614",
  BADGE1: "984908515900547092",
  BADGE2: "985038477487919194",
  BADGE3: "985038479492808715",
  FLAG: "985056775554342973",
  CUP: "985137841027821589",
  COIN: "985243708419108914",
  MONEY: "985245648716697680",
  GAME: "916623575824338974",
  HEART: "991939196405174442",
  APPROVE: "933341948402618378",
  APPROVE_GREY: "1016628985351909457",
  NFTS: "977508805011181638",
  QUESTION: "1008993149076635698",
  SWAP: "933340602223955998",
  LIKE: "900370883594551348",
  PAWCOIN: "887275176113373194",
  EXP: "1016985999039016982",
  LEFT_ARROW: "933339868224958504",
  RIGHT_ARROW: "933339868233359380",
  CASH: "933341119998210058",
  BUBBLE_CASH: "1022765345875968040",
  TIP: "933384794627248128",
  SEARCH: "933341511062552626",
  PREDICTION: "931194309385003058",
  FELLOWSHIP: "922044644928421888",
}

export const msgColors: Record<string, ColorResolvable> = {
  PRIMARY: "#E88B88",
  ERROR: "#D94F50",
  SUCCESS: "#5cd97d",
}

export function getEmbedFooter(texts: string[]): string {
  return texts.join(` ${DOT} `)
}

export function hasAdministrator(member?: GuildMember | null) {
  if (!member) return false
  return member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
}

export function getCommandsList(
  _emoji: GuildEmoji | string,
  commands: Record<string, Pick<Command, "command" | "brief" | "experimental">>
) {
  const emoji = getEmoji("reply")
  const correctBrief = (brief: string) =>
    brief.endsWith(".") ? brief : `${brief}.`
  return Object.values(commands)
    .filter((c) => !c.experimental)
    .map(
      (c) =>
        `[**${c.command}**](${HOME_PAGE_URL})\n${emoji}${correctBrief(c.brief)}`
    )
    .join("\n\n")
}

export function maskAddress(str: string, minLen?: number) {
  const num = minLen || 8
  if (str.length > num && str.length > 3) {
    const a = Math.round((num * 2) / 3)
    const b = num - a

    return `${str.substring(0, a)}***${str.substring(
      str.length - b,
      str.length
    )}`
  }

  return str
}

export function getEmoji(key: string, animated?: boolean) {
  const emojiKey = key.toUpperCase()
  const emoji = emojis[emojiKey]
  if (!emoji) {
    return ":jigsaw:"
  }

  if (isNaN(+emoji)) {
    return emoji
  }

  return `<${animated ? "a" : ""}:${key.replace(/-/g, "_").toLowerCase()}:${
    emojis[emojiKey]
  }>`
}

export function roundFloatNumber(n: number, fractionDigits = 1) {
  return parseFloat(parseFloat(`${n}`).toFixed(fractionDigits))
}

export function capFirst(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export function getEmojiURL(emojiId: string) {
  return `https://cdn.discordapp.com/emojis/${emojiId}.png?size=240&quality=lossless`
}

export function shortenHashOrAddress(hash: string) {
  return `${hash.slice(0, 6)}...${hash.slice(hash.length - 6)}`
}

export function getDateStr(timestamp: number) {
  return dayjs(timestamp).format("MMMM DD, YYYY")
}

export function getTimeFromNowStr(timestamp: string) {
  return dayjs(timestamp).fromNow()
}

export function isValidHttpUrl(urlStr: string) {
  let url
  try {
    url = new URL(urlStr)
  } catch (_) {
    return false
  }
  return url.protocol === "http:" || url.protocol === "https:"
}

/**
 * Returns result as boolean based on the `percentage` passed in.
 * @param percentage: range is [0-1] or [1-100]. Returns false if out of range
 */
export function getChance(percentage: number) {
  if (percentage >= 100 || percentage <= 0) return false
  if (percentage > 1 && percentage < 100) percentage /= 100
  return Math.random() < percentage
}
