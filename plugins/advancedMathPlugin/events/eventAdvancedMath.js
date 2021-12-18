export const id = "EVENT_ADVANCED_MATH";
export const name = "Advanced Math Functions";
export const groups = ["EVENT_GROUP_MATH"];

export const autoLabel = (fetchArg, args) => {
  const x = fetchArg("vectorX");
  if (fetchArg("operation") === "sqrt") {
      return `${x} = sqrt(${x})`;
  } else if (fetchArg("operation") === "sins") {
      return `${x} = sin(${x}) * ${fetchArg("scale")}`;
  } else if (fetchArg("operation") === "coss") {
      return `${x} = cos(${x}) * ${fetchArg("scale")}`;
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
    key: "scale",
    type: "union",
    label: "Scale",
    type: "union",
    types: ["number", "variable", "property"],
    defaultType: "number",
    min: 0,
    max: 255,
    defaultValue: {
      number: 100,
      variable: "LAST_VARIABLE",
      property: "$self$:xpos",
    },
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
  const { _rpn, _addCmd, _setVariable, variableSetToUnionValue, getVariableAlias, variableSetToValue } = helpers;
  const {vectorX, operation, scale} = input;
  
  if (scale.type === "number") {
    variableSetToValue("T2", scale.value)
  } else {
    variableSetToUnionValue("T2", scale)
  }
  if (operation === "sqrt") {
    _rpn()
      .refVariable(vectorX)
      .operator(".ISQRT")
      .stop();
  } else if (operation === "sins") {
    _addCmd("VM_SIN_SCALE", getVariableAlias("T2"), getVariableAlias(vectorX), 7);
  } else if (operation === "coss") {
    _addCmd("VM_COS_SCALE", getVariableAlias("T2"), getVariableAlias(vectorX), 7);
  }

  _setVariable(vectorX, getVariableAlias("T2"));
};