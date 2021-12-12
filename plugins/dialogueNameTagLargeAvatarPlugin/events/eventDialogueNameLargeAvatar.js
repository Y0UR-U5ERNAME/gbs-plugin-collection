export const id = "EVENT_DIALOGUE_NAME_LARGE_AVATAR";
export const groups = ["EVENT_GROUP_DIALOGUE"];
export const name = "Dialogue With Name Tag/Large Avatar";
export const fields = [].concat(
  [
    {
      key: "__scriptTabs",
      type: "tabs",
      defaultValue: "text",
      values: {
        text: "Text",
        nameTag: "Name Tag",
        avatar: "Avatar",
      },
    },
  ],
  [
    {
      key: "text",
      type: "textarea",
      placeholder: "Text...",
      multiple: true,
      defaultValue: "",
      flexBasis: "100%",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["text"],
        },
      ],
    },
  ],
  [
    {
      key: "nameTag",
      type: "textarea",
      placeholder: "Name",
      defaultValue: "",
      flexBasis: "100%",
      conditions: [
        {
          key: "__scriptTabs",
          in: ["nameTag"],
        },
      ],
    },
    {
      key: "nameX",
      label: "X Position",
      type: "number",
      min: 1,
      max: 20,
      defaultValue: 2,
      conditions: [
        {
          key: "__scriptTabs",
          in: ["nameTag"],
        },
      ],
    },
  ],
  {
    type: "group",
    conditions: [
      {
        key: "__scriptTabs",
        in: ["avatar"],
      },
    ],
    fields: [
      {
        key: "avatarType",
        type: "select",
        label: "Avatar Type",
        options: [
          ["small", "16x16 (from assets/avatars)"],
          ["large", "Large (made of text)"],
        ],
        defaultValue: "small",
      },
      {
        key: "avatarId",
        type: "avatar",
        toggleLabel: "Add Avatar",
        label: "Avatar",
        defaultValue: "",
        optional: true,
        conditions: [
          {
            key: "avatarType",
            eq: "small",
          },
        ],
      },
      {
        key: "largeAvatar",
        type: "textarea",
        placeholder: "Text...",
        defaultValue: "",
        flexBasis: "100%",
        conditions: [
          {
            key: "avatarType",
            eq: "large",
          },
        ],
      },
    ]
  },  
  {
    type: "group",
    conditions: [
      {
        key: "__scriptTabs",
        in: ["avatar"],
      },
      {
        key: "avatarType",
        eq: "large",
      },
    ],
    fields: [
      {
        key: "avatarX",
        label: "X Position",
        type: "number",
        min: 1,
        max: 20,
        defaultValue: 2,
      },
      {
        key: "avatarY",
        label: "Y Position",
        type: "number",
        min: 1,
        max: 18,
        defaultValue: 2,
      },
      {
        key: "avatarWidth",
        label: "Width (in tiles)",
        type: "number",
        min: 1,
        max: 18,
        defaultValue: 3,
      },
      {
        key: "orientation",
        label: "Orientation",
        type: "select",
        options: [
          ["left", "Left of text"],
          ["right", "Right of text"],
        ],
        defaultValue: "left",
      },
    ]
  }
);
export const compile = (input, helpers) => {
  const { textDialogue, _getMemInt8, _addComment, _stackPushConst, _stackPop, ifVariableValue, _set, getVariableAlias} = helpers;
  _addComment("Dialogue With Name Tag/Large Avatar");
  _stackPushConst(0);
  _getMemInt8(".ARG0", "text_draw_speed")
  _set(getVariableAlias("T2"), ".ARG0");
  _stackPop(1);
  if (input.avatarType === "small") {
    for (i = 0; i <= 5; i++) {
      ifVariableValue("T2", ".EQ", 2 ** i - 1, () => {
        textDialogue(input.text.map(e => `\\001\\001\\003\\${input.nameX}\\001${input.nameTag}\\003\\${input.avatarId ? 4 : 2}\\002\\002\\001\\001\\00${i + 1}${e || " "}`), input.avatarId);
      }, []);
    }
  } else {
    input.text.forEach((e, i) => {
      input.text[i] += "\n".repeat(Math.max((input.largeAvatar.match(/\n/g) || []).length - (e.match(/\n/g) || []).length, 0))
    });
    for (i = 0; i <= 5; i++) {
      ifVariableValue("T2", ".EQ", 2 ** i - 1, () => {
        textDialogue(input.text.map(e => `\\001\\001\\003\\${oct(input.nameX)}\\001${input.nameTag}\\003\\${oct(input.avatarX)}\\${oct(input.avatarY)}${input.largeAvatar.replace(/\n/g, `\\004\\${oct(-input.avatarWidth + 1)}\\002`)}\\003\\${oct(input.avatarWidth + input.avatarX)}\\002\\002\\001\\001\\${oct(i + 1)}${e || " "}`));
      }, []);
    }
  }
};

oct = num => ((256 + (num % 256)) % 256).toString(8).padStart(3, "0");