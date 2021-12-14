export const id = "EVENT_WHILE_LOOP";
export const name = "While Loop";
export const groups = ["EVENT_GROUP_CONTROL_FLOW"];

export const autoLabel = (fetchArg, args) => {
  if (args.expression) {
    return "While " + fetchArg("expression");
  } else {
    return "While Loop"
  }
};

export const fields = [
  {
    key: "expression",
    type: "matharea",
    rows: 5,
    placeholder: "e.g. $health >= 0...",
    defaultValue: "",
  },
  {
    key: "events",
    label: "Looped",
    type: "events",
  },
];

export const compile = (input, helpers) => {
  const { _addComment, _compilePath, _stackPushEvaluatedExpression, _ifConst, getNextLabel, _jump, _label } = helpers;
  const {expression, events} = input;

  const startLabel = getNextLabel();
  const contLabel = getNextLabel();
  const endLabel = getNextLabel();
  _addComment(expression ? "While " + expression : "While Loop");
  _label(startLabel);
  _stackPushEvaluatedExpression(expression || "0");
  _ifConst(".GT", ".ARG0", 0, contLabel, 1);
  _jump(endLabel);
  _label(contLabel);
  _compilePath(events);
  _jump(startLabel);
  _label(endLabel);
};