export const id = "EVENT_SET_PALETTE_COLORS";
export const name = "Set Palette Colors";
export const groups = ["EVENT_GROUP_COLOR"];

export const autoLabel = (fetchArg, args) => {
  if (fetchArg("sys") === "dmg") {
    return `Set ${fetchArg("pal")} Colors`;
  } else {
    return `Set ${fetchArg("type") === "Bkg" ? "Background" : "Sprite"} Palette ${fetchArg("cpal")} Colors`;
  }
};

const gbcColor = i => {
  return {
    type: "group",
    conditions: [
      {
        key: "sys",
        eq: "gbc",
      },
    ].concat(i === 3 ? [{key: "type", eq: "Bkg",}] : []),
    fields: [
      {
        label: `Color ${i + 1}`,
        width: "50%",
      },
      {
        type: "group",
        fields: [
          {
            key: `r${i}`,
            label: "R",
            type: "number",
            min: 0,
            max: 31,
            defaultValue: [29, 22, 10, 4][i],
          },
          {
            key: `g${i}`,
            label: "G",
            type: "number",
            min: 0,
            max: 31,
            defaultValue: [31, 30, 19, 5][i],
          },
          {
            key: `b${i}`,
            label: "B",
            type: "number",
            min: 0,
            max: 31,
            defaultValue: [28, 17, 15, 10][i],
          },
        ]
      },
    ],
  }
}

export const fields = [
  {
    key: "sys",
    type: "select",
    options: [
      ["dmg", "DMG Palette"],
      ["gbc", "GBC Palette"],
    ],
    defaultValue: "dmg",
    width: "50%",
  },
  {
    type: "group",
    conditions: [
      {
        key: "sys",
        eq: "dmg",
      },
    ],
    fields: [
      {
        key: "pal",
        type: "select",
        options: [
          ["BGP", "BGP"],
          ["OBP0", "OBP0"],
          ["OBP1", "OBP1"],
        ],
        defaultValue: "BGP",
      },
    ],
  },
  {
    type: "group",
    conditions: [
      {
        key: "sys",
        eq: "dmg",
      },
    ],
    fields: [
      {
        key: "c0",
        label: "Color 1",
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: 0,
        max: 3,
        defaultValue: {
          number: 0,
          variable: "LAST_VARIABLE",
          property: "$self$:xpos",
        },
      },
      {
        key: "c1",
        label: "Color 2",
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: 0,
        max: 3,
        defaultValue: {
          number: 1,
          variable: "LAST_VARIABLE",
          property: "$self$:xpos",
        },
      },
      {
        key: "c2",
        label: "Color 3",
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: 0,
        max: 3,
        defaultValue: {
          number: 2,
          variable: "LAST_VARIABLE",
          property: "$self$:xpos",
        },
      },
      {
        key: "c3",
        label: "Color 4",
        type: "union",
        types: ["number", "variable", "property"],
        defaultType: "number",
        min: 0,
        max: 3,
        defaultValue: {
          number: 3,
          variable: "LAST_VARIABLE",
          property: "$self$:xpos",
        },
        conditions: [
          {
            key: "pal",
            eq: "BGP"
          },
        ],
      },
    ],
  },
  {
    type: "group",
    conditions: [
      {
        key: "sys",
        eq: "gbc",
      },
    ],
    fields: [
      {
        key: "type",
        type: "select",
        options: [
          ["Bkg", "Background Palette"],
          ["Spr", "Sprite Palette"],
        ],
        defaultValue: "Bkg",
      },
      {
        key: "cpal",
        type: "number",
        min: 1,
        max: 8,
        defaultValue: 1,
        width: "50%",
      },
    ],
  },
  gbcColor(0),
  gbcColor(1),
  gbcColor(2),
  gbcColor(3),
  {
    type: "group",
    conditions: [
      {
        key: "sys",
        eq: "dmg",
      },
    ],
    width: "50%",
    fields: [
      {
        label: "Note: 0 is white, 1 is light green, 2 is dark green, and 3 is black.",
      },
    ],
  },
];

export const compile = (input, helpers) => {
  const { _addCmd, variableFromUnion, _rpn, _stackPop, getVariableAlias } = helpers
  const {sys, pal, c0, c1, c2, c3, type, cpal, r0, g0, b0, r1, g1, b1, r2, g2, b2, r3, g3, b3} = input;

  if (sys === "dmg") {
    if ([c0, c1, c2, pal === "BGP" ? c3 : c2].every(e => e.type === "number")) {
      // not VM_LOAD_PALETTE because it has a bug in 3.0.2
      let p;
      if (pal === "BGP") {
        p = (((c3.value) & 0x03) << 6) | (((c2.value) & 0x03) << 4) | (((c1.value) & 0x03) << 2) | ((c0.value) & 0x03);
      } else {
        p = (((c2.value) & 0x03) << 6) | (((c1.value) & 0x03) << 4) | (((c0.value) & 0x03) << 2);
      }
      _addCmd("VM_SET_CONST_UINT8", `^/_DMG_palette + ${["BGP", "OBP0", "OBP1"].indexOf(pal)}/`, p);
      _addCmd("VM_SET_CONST_UINT8", `_${pal}_REG`, p);
    } else {
      const C0 = getVariableAlias(variableFromUnion(c0, "T0"));
      const C1 = getVariableAlias(variableFromUnion(c1, "T1"));
      const C2 = getVariableAlias(variableFromUnion(c2, "T2"));
      if (pal === "BGP") {
        _rpn()
          .ref(C2).int8(3).operator(".B_AND").int8(16).operator(".MUL")         // (((C2) & 0x03) << 4)
          .ref(C1).int8(3).operator(".B_AND").int8(4).operator(".MUL")          // (((C1) & 0x03) << 2)
          .operator(".B_OR")
          .ref(C0).int8(3).operator(".B_AND")                                   // ((C0) & 0x03)
          .operator(".B_OR")
          .stop();
        const C3 = getVariableAlias(variableFromUnion(c3, "T3")); // has to be put here, otherwise will not work
        _rpn()
          .ref(C3).int8(3).operator(".B_AND").int8(64).operator(".MUL")         // (((C3) & 0x03) << 6)
          .operator(".B_OR")
          .stop();
      } else {
        _rpn()
          .ref(C2).int8(3).operator(".B_AND").int8(64).operator(".MUL")         // (((C2) & 0x03) << 6)
          .ref(C1).int8(3).operator(".B_AND").int8(16).operator(".MUL")         // (((C1) & 0x03) << 4)
          .operator(".B_OR")
          .ref(C0).int8(3).operator(".B_AND").int8(4).operator(".MUL")          // (((C0) & 0x03) << 2)
          .operator(".B_OR")
          .stop();
      }
      _addCmd("VM_SET_UINT8", `^/_DMG_palette + ${["BGP", "OBP0", "OBP1"].indexOf(pal)}/`, ".ARG0");
      _addCmd("VM_SET_UINT8", `_${pal}_REG`, ".ARG0");
      _stackPop(1);
    }
  } else {
    _addCmd("VM_LOAD_PALETTE", 2 ** (cpal - 1), `^/(.PALETTE_${type === "Bkg" ? "BKG" : "SPRITE"} | .PALETTE_COMMIT)/`);
    if (type === "Bkg") {
      _addCmd(".CGB_PAL", r0, g0, b0, r1, g1, b1, r2, g2, b2, r3, g3, b3);
    } else {
      _addCmd(".CGB_PAL", 0, 0, 0, r0, g0, b0, r1, g1, b1, r2, g2, b2);
    }
  }
};