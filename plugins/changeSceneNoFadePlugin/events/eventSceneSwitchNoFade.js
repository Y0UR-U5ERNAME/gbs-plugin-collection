export const id = "EVENT_SCENE_SWITCH_NO_FADE";
export const name = "Change Scene With No Fade (Glitchy)";
export const groups = ["EVENT_GROUP_SCENE"];

export const autoLabel = (fetchArg) => {
  return `Change Scene To ${fetchArg("sceneId")} At {${fetchArg("x")},${fetchArg("y")}} With No Fade (Glitchy)`;
};

export const fields = [
  {
    key: "sceneId",
    label: "Scene",
    type: "scene",
    defaultValue: "LAST_SCENE",
  },
  {
    key: "x",
    label: "X",
    type: "number",
    min: 0,
    max: 255,
    defaultValue: 0,
    width: "50%",
  },
  {
    key: "y",
    label: "Y",
    type: "number",
    min: 0,
    max: 255,
    defaultValue: 0,
    width: "50%",
  },
  {
    key: "direction",
    label: "Direction",
    type: "direction",
    width: "50%",
    defaultValue: "",
  },
  {
    label: "Note: Background and Sprite Palettes from this scene will not be loaded automatically.",
  },
];

export const compile = (input, helpers) => {
  const { _addComment, options, _setConst, _actorSetPosition, _actorSetDirection, _raiseException, _importFarPtrData, _addNL } = helpers;
  
  //copied from ScriptBuilder.ts but without _fadeOut
  helpers.includeActor = true;
  _addComment("Load Scene With No Fade");
  const { scenes } = options;
  const sceneIndex = scenes.findIndex((s) => s.id === input.sceneId);
  if (sceneIndex > -1) {
    _setConst("ACTOR", 0);
    _setConst("^/(ACTOR + 1)/", input.x * 8 * 16);
    _setConst("^/(ACTOR + 2)/", input.y * 8 * 16);
    _actorSetPosition("ACTOR");
    const asmDir = toASMDir(input.direction);
    if (asmDir) {
      _actorSetDirection("ACTOR", asmDir);
    }
    _raiseException("EXCEPTION_CHANGE_SCENE", 3);
    _importFarPtrData(`scene_${sceneIndex}`);
    _addNL();
  }
};

const toASMDir = direction => {
  if (direction === "left") {
    return ".DIR_LEFT";
  } else if (direction === "right") {
    return ".DIR_RIGHT";
  } else if (direction === "up") {
    return ".DIR_UP";
  } else if (direction === "down") {
    return ".DIR_DOWN";
  }
  return ".DIR_DOWN";
};