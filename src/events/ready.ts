import { DiscordEvent } from "."
import { logger } from "../logger"
import ChannelLogger from "utils/ChannelLogger"
import { wrapError } from "utils/wrapError"

export let IS_READY = false

const event: DiscordEvent<"ready"> = {
  name: "ready",
  once: false,
  execute: async (client) => {
    wrapError(null, async () => {
      if (!client.user) return
      logger.info(`Bot [${client.user.username}] is ready`)
      ChannelLogger.ready(client)

      IS_READY = true
    })
  },
}

export default event
