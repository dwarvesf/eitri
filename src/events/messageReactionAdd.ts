import { DiscordEvent } from "."
import { wrapError } from "utils/wrapError"

const event: DiscordEvent<"messageReactionAdd"> = {
  name: "messageReactionAdd",
  once: false,
  execute: async (_reaction, _user) => {
    _reaction
      .fetch()
      .then((reaction) => {
        _user
          .fetch()
          .then((user) => {
            reaction.message
              .fetch()
              .then(async (msg) => {
                wrapError(msg, async () => {
                  if (user.bot) return
                  if (!msg.guild) return
                })
              })
              .catch(() => null)
          })
          .catch(() => null)
      })
      .catch(() => null)
  },
}

export default event
