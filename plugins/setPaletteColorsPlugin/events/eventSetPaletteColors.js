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
        key: `cc${i}`,
        type: "checkbox",
        label: `Color ${i + 1}`,
        alignCheckbox: true,
        defaultValue: true,
        width: "50%",
      },
      {
        type: "group",
        conditions: [
          {
            key: `cc${i}`,
            eq: true,
          },
        ],
        fields: [
          {
            key: `r${i}`,
            label: "R",
            type: "union",
            types: ["number", "variable", "property"],
            defaultType: "number",
            min: 0,
            max: 31,
            defaultValue: {
              number: [29, 22, 10, 4][i],
              variable: "LAST_VARIABLE",
              property: "$self$:xpos",
            },
          },
          {
            key: `g${i}`,
            label: "G",
            type: "union",
            types: ["number", "variable", "property"],
            defaultType: "number",
            min: 0,
            max: 31,
            defaultValue: {
              number: [31, 30, 19, 5][i],
              variable: "LAST_VARIABLE",
              property: "$self$:xpos",
            },
          },
          {
            key: `b${i}`,
            label: "B",
            type: "union",
            types: ["number", "variable", "property"],
            defaultType: "number",
            min: 0,
            max: 31,
            defaultValue: {
              number: [28, 17, 15, 10][i],
              variable: "LAST_VARIABLE",
              property: "$self$:xpos",
            },
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
  const { _addCmd, variableFromUnion, _rpn, _stackPop, getVariableAlias, _setConst, appendRaw, getNextLabel, variableSetToUnionValue } = helpers
  const {sys, pal, c0, c1, c2, c3, type, cpal} = input;

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
    let R, G, B;
    const l1 = getNextLabel();
    const l2 = getNextLabel();
    const bank = ".CURRENT_SCRIPT_BANK";
    
    for (var i = 0; i < (type === "Bkg" ? 4 : 3); i++) {
      if (input[`cc${i}`]) {
        if (["r", "g", "b"].every(e => input[e + i].type === "number")) {
          _setConst(getVariableAlias("T0"), ((input[`r${i}`].value) & 0x1f) | (((input[`g${i}`].value) & 0x1f) << 5) | (((input[`b${i}`].value) & 0x1f) << 10));
        } else {
          variableSetToUnionValue("T0", input[`r${i}`])
          variableSetToUnionValue("T1", input[`g${i}`])
          variableSetToUnionValue("T2", input[`b${i}`])
          R = getVariableAlias("T0");
          G = getVariableAlias("T1");
          B = getVariableAlias("T2");
          _rpn()
            .ref(R).int16(0x1f).operator(".B_AND")                              // ((R) & 0x1f)
            .ref(G).int16(0x1f).operator(".B_AND").int16(32).operator(".MUL")   // (((G) & 0x1f) << 5)
            .operator(".B_OR")
            .ref(B).int16(0x1f).operator(".B_AND").int16(1024).operator(".MUL") // (((B) & 0x1f) << 10)
            .operator(".B_OR")
            .stop();
          _addCmd("VM_SET", R, ".ARG0");
          _stackPop(1);
        }
        _setConst(getVariableAlias("T1"), i);
        _setConst(getVariableAlias("T2"), cpal - 1);
        _addCmd("VM_CALL_NATIVE", bank, `${l1}$`);
      }
    }
    _addCmd("VM_JUMP", `${l2}$`);

    // from https://discord.com/channels/554713715442712616/925672652339810335/931581094556499978
    appendRaw(
      `
      ${l1}$:
      ld hl, #(_script_memory + (${getVariableAlias("T0")} << 1)) 
      ld a, (hl+)
      ld h, (hl)
      ld l, a
      push hl

      ld a, (_script_memory + (${getVariableAlias("T1")} << 1)) 
      ld h, a
      ld a, (_script_memory + (${getVariableAlias("T2")} << 1)) 
      ld l, a
      push hl

      call _set_${type === "Bkg" ? "bkg" : "sprite"}_palette_entry
      add sp, #4
      ret
      ${l2}$:
      `
    );
  }
};
