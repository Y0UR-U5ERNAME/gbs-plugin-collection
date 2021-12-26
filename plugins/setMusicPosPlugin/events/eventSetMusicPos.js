export const id = "EVENT_SET_MUSIC_POS";
export const name = "Set Music Position";
export const groups = ["EVENT_GROUP_MUSIC"];

export const autoLabel = (fetchArg, args) => {
  return `Set Music Position To Pattern ${fetchArg("pattern") | 0} Row ${fetchArg("row") | 0}`;
};

export const fields = [
  {
    key: "pattern",
    label: "Pattern",
    type: "number",
    min: 0,
    max: 63,
    defaultValue: 0,
  },
  /*
  doesn't work
  {
    key: "row",
    label: "Row",
    type: "number",
    min: 0,
    max: 63,
    defaultValue: 0,
  },
  */
];

export const compile = (input, helpers) => {
  const { _addCmd } = helpers;
  const {pattern, row} = input;

  _addCmd("VM_MUSIC_SETPOS", pattern + 1, /*row*/ 0);
};