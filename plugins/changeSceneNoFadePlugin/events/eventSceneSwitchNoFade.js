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
  const { _addComment, options, _setConst, _actorSetPosition, _actorSetDirection, _raiseException, _importFarPtrData, _addNL, _declareLocal, _localRef } = helpers;
  
  //copied from ScriptBuilder.ts but without _fadeOut
  const actorRef = _declareLocal("actor", 4);
  _addComment("Load Scene With No Fade");
  const { scenes } = options;
  const scene = scenes.find((s) => s.id === input.sceneId);
  if (scene) {
    _setConst(actorRef, 0);
    _setConst(_localRef(actorRef, 1), input.x * 8 * 16);
    _setConst(_localRef(actorRef, 2), input.y * 8 * 16);
    _actorSetPosition(actorRef);
    const asmDir = toASMDir(input.direction);
    if (asmDir) {
      _actorSetDirection(actorRef, asmDir);
    }
    _raiseException("EXCEPTION_CHANGE_SCENE", 3);
    _importFarPtrData(scene.symbol);
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
