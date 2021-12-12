export const id = "EVENT_TRANSFER_SGB_PACKET";
export const name = "Transfer SGB Packet";
export const groups = ["EVENT_GROUP_COLOR"];

export const fields = [
  {
    key: "cmd",
    label: "Command",
    type: "select",
    options: [
        [4, "Apply Palette to Rectangular Area"]
    ],
    defaultValue: 4
  },
  {
    key: "ins",
    label: "Inside surrounded area",
    type: "checkbox",
    defaultValue: false
  },
  {
    key: "p_ins",
    type: "select",
    defaultValue: "0",
    options: [
        [0, "BG Palette 5"],
        [1, "BG Palette 6"],
        [2, "BG Palette 7"],
        [3, "BG Palette 8"]
    ],
    conditions: [
        {
            key: "ins",
            eq: true
        }
    ],
    defaltValue: 0
  },
  {
    key: "sur",
    label: "Surrounding character line",
    type: "checkbox",
    defaultValue: false
  },
  {
    key: "p_sur",
    type: "select",
    defaultValue: "0",
    options: [
        [0, "BG Palette 5"],
        [1, "BG Palette 6"],
        [2, "BG Palette 7"],
        [3, "BG Palette 8"]
    ],
    conditions: [
        {
            key: "sur",
            eq: true
        }
    ],
    defaltValue: 0
  },
  {
    key: "out",
    label: "Outside surrounded area",
    type: "checkbox",
    defaultValue: false
  },
  {
    key: "p_out",
    type: "select",
    defaultValue: "0",
    options: [
        [0, "BG Palette 5"],
        [1, "BG Palette 6"],
        [2, "BG Palette 7"],
        [3, "BG Palette 8"]
    ],
    conditions: [
        {
            key: "out",
            eq: true
        }
    ],
    defaltValue: 0
  },
  {
    key: "tl",
    label: "Top Left Position"
  },
  {
    key: "left",
    label: "X",
    type: "number",
    min: 0,
    max: 19,
    defaultValue: 0,
    width: "50%"
  },
  {
    key: "up",
    label: "Y",
    type: "number",
    min: 0,
    max: 17,
    defaultValue: 0,
    width: "50%"
  },
  {
    key: "br",
    label: "Bottom Right Position"
  },
  {
    key: "right",
    label: "X",
    type: "number",
    min: 0,
    max: 19,
    defaultValue: 0,
    width: "50%"
  },
  {
    key: "down",
    label: "Y",
    type: "number",
    min: 0,
    max: 17,
    defaultValue: 0,
    width: "50%"
  },
];

export const compile = (input, helpers) => {
  const { appendRaw } = helpers;
  const {cmd, ins, sur, out, p_ins, p_sur, p_out, left, up, right, down} = input;
  appendRaw(`
    VM_SGB_TRANSFER   
        .db ${(cmd << 3) | 1}, 1, ${ins | (sur << 1) | (out << 2)}, ${p_ins | (p_sur << 2) | (p_out << 4)}, ${left}, ${up}, ${right}, ${down}, 0, 0, 0, 0, 0, 0, 0, 0
  `);
};

export const allowBeforeInitFade = true;
