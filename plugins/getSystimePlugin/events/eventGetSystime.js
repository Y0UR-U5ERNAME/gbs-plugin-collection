export const id = "EVENT_GET_SYSTIME";
export const name = "Store System Time In Variable";
export const groups = ["EVENT_GROUP_TIMER"];

export const autoLabel = (fetchArg, args) => {
  return "Store System Time In " + fetchArg("variable");
};

export const fields = [
  {
    key: "variable",
    type: "variable",
    defaultValue: "LAST_VARIABLE",
  },
];

export const compile = (input, helpers) => {
  const { _addCmd, getVariableAlias } = helpers;
  const {variable} = input;

  _addCmd("VM_GET_SYSTIME", getVariableAlias(variable));
};