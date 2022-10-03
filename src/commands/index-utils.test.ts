import { isAcceptableCmdToHelp } from "./index-utils"
test.each([
  // $nr set
  [
    {
      cmd: "nftrole",
      aliases: ["nr"],
      action: "set",
      msg: "$nr set",
    },
    true,
  ],
  // $nft set
  [
    {
      cmd: "nftrole",
      aliases: ["nr"],
      action: "set",
      msg: "$nftrole set",
    },
    true,
  ],
  // $help
  [
    {
      cmd: "help",
      aliases: [],
      action: "",
      msg: "$help",
    },
    true,
  ],
  [
    {
      cmd: "nftrole",
      aliases: ["nr"],
      action: "set",
      msg: "$nr set @M",
    },
    false,
  ],
  // $gm
  [
    {
      cmd: "gm",
      aliases: ["gn"],
      action: "",
      msg: "$gm",
    },
    true,
  ],
])("isAcceptableCmdToHelp(%o)", (input, output) => {
  expect(
    isAcceptableCmdToHelp(input.cmd, input.aliases, input.action, input.msg)
  ).toStrictEqual(output)
})
