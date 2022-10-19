export const id = "EVENT_ADVANCED_MATH";
export const name = "Advanced Math Functions";
export const groups = ["EVENT_GROUP_MATH"];

export const autoLabel = (fetchArg, args) => {
  const x = fetchArg("vectorX");
  const y = fetchArg("vectorY");
  if (fetchArg("operation") === "sqrt") {
      return `${x} = sqrt(${x})`;
  } else if (fetchArg("operation") === "sins") {
      return `${x} = sin(${y}) * ${x}`;
  } else if (fetchArg("operation") === "coss") {
      return `${x} = cos(${y}) * ${x}`;
  }
};

export const fields = [
  {
    key: "vectorX",
    type: "variable",
    defaultValue: "LAST_VARIABLE",
  },
  {
    key: "operation",
    type: "select",
    options: [
      ["sqrt", "Square Root"],
      ["sins", "Sine Scale"],
      ["coss", "Cosine Scale"],
    ],
    defaultValue: "sqrt",
    width: "50%",
  },
  {
    key: "vectorY",
    type: "variable",
    defaultValue: "LAST_VARIABLE",
    conditions: [
      {
        key: "operation",
        ne: "sqrt",
      },
    ],
  },
  {
    key: "scale",
    label: "Accuracy",
    type: "number",
    min: 0,
    max: 7,
    defaultValue: 7,
    conditions: [
      {
        key: "operation",
        ne: "sqrt",
      },
    ],
  },
  {
    label: "Note: Results that are not integers will be rounded down."
  }
];

export const compile = (input, helpers) => {
  const { _rpn, _addCmd, _setVariable, getVariableAlias } = helpers;
  const {vectorX, vectorY, operation, scale} = input;
  
  if (operation === "sqrt") {
    _rpn()
      .refVariable(vectorX)
      .operator(".ISQRT")
      .stop();
    _setVariable(vectorX, ".ARG0");
  } else if (operation === "sins") {
    _addCmd("VM_SIN_SCALE", getVariableAlias(vectorX), getVariableAlias(vectorY), scale);
  } else if (operation === "coss") {
    _addCmd("VM_COS_SCALE", getVariableAlias(vectorX), getVariableAlias(vectorY), scale);
  }
};
