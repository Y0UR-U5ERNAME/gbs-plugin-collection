export const id = "EVENT_ACTOR_SET_BOUNDS";
export const name = "Actor Set Collision Box";
export const groups = ["EVENT_GROUP_ACTOR"];

export const fields = [
  {
    key: "actorId",
    label: "Actor",
    type: "actor",
    defaultValue: "$self$",
    width: "100%",
  },
  {
    type: "group",
    fields: [
      {
        key: "x",
        label: "X",
        type: "number",
        min: -96,
        max: 96,
        defaultValue: 0,
        width: "50%",
      },
      {
        key: "y",
        label: "Y",
        type: "number",
        min: -96,
        max: 96,
        defaultValue: 0,
        width: "50%",
      },
      {
        key: "width",
        label: "Width",
        type: "number",
        min: 0,
        max: 128,
        defaultValue: 16,
        width: "50%",
      },
      {
        key: "height",
        label: "Height",
        type: "number",
        min: 0,
        max: 128,
        defaultValue: 16,
        width: "50%",
      },
    ],
  },
];

export const compile = (input, helpers) => {
  const { actorSetActive, actorSetBounds, scene } = helpers;
  const {actorId, x, y, width, height} = input;
  actorSetActive(actorId);
  actorSetBounds(x, x + width - 1, y - 16, y - 16 + height - 1);
};

export const waitUntilAfterInitFade = false;
