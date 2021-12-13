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
    key: "topDown",
    label: "Top Down 2D Scene Mode",
    type: "checkbox",
    defaultValue: false,
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
  const { actorSetActive, actorSetBounds } = helpers;
  const {actorId, topDown, x, y, width, height} = input;
  actorSetActive(actorId);
  if (topDown) {
    actorSetBounds(x, width - 8, y - height + 8, y);
  } else {
    actorSetBounds(x, width, y - height + 8, y + 8);
  }
};

export const allowBeforeInitFade = true;