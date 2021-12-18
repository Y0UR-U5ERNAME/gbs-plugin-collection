export const id = "EVENT_IF_DEVICE";
export const name = "If Running On Device";
export const groups = ["EVENT_GROUP_CONTROL_FLOW", "EVENT_GROUP_COLOR"];

export const autoLabel = (fetchArg, args) => {
  return "If Running On " + [
    "Super Game Boy",
    "Game Boy Color/Game Boy Advance",
    "Game Boy Advance"
  ][[
    "_is_SGB",
    "_is_CGB",
    "_is_GBA"
  ].indexOf(fetchArg("type"))];
};

export const fields = [
  {
    key: "type",
    label: "Device",
    type: "select",
    options: [
      ["_is_SGB", "Super Game Boy"],
      ["_is_CGB", "Game Boy Color/Game Boy Advance"],
      ["_is_GBA", "Game Boy Advance"],
    ],
    defaultValue: "_is_SGB",
  },
  {
    key: "true",
    label: "True",
    type: "events",
  },
  {
    key: "__collapseElse",
    label: "Else",
    type: "collapsable",
    defaultValue: true,
    conditions: [
      {
        key: "__disableElse",
        ne: true,
      },
    ],
  },
  {
    key: "false",
    label: "False",
    conditions: [
      {
        key: "__collapseElse",
        ne: true,
      },
      {
        key: "__disableElse",
        ne: true,
      },
    ],
    type: "events",
  },
];

export const compile = (input, helpers) => {
  const { getNextLabel, _stackPushConst, _getMemUInt8, _ifConst, _compilePath, _jump, _label } = helpers;
  const {type, __disableElse} = input;

  
  const falseLabel = getNextLabel();
  const endLabel = getNextLabel();
  _stackPushConst(0);
  _getMemUInt8(".ARG0", type);
  _ifConst(".NE", ".ARG0", 1, falseLabel, 1);
  _compilePath(input.true);
  _jump(endLabel);
  _label(falseLabel);
  _compilePath(__disableElse ? [] : input.false);
  _label(endLabel);
};