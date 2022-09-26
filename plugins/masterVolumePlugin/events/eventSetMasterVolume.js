export const id = "EVENT_SET_MASTER_VOL";
export const name = "Set Master Volume";
export const groups = ["EVENT_GROUP_MUSIC"];

export const autoLabel = (fetchArg, args) => {
  return "Set Master Volume To L" + fetchArg("l")+" R"+fetchArg("r")
};

export const fields = [
  {
    key: "l",
    label: "Left Volume",
    type: "slider",
    min: 0,
    max: 7,
    defaultValue: 7,
  },
  {
    key: "r",
    label: "Right Volume",
    type: "slider",
    min: 0,
    max: 7,
    defaultValue: 7,
  },
  {
    label: "Note that setting the volume to 0 will not mute the volume.",
  },
];

export const compile = (input, helpers) => {
  const { _addCmd } = helpers;
  const {l, r} = input;
  
  _addCmd("VM_SOUND_MASTERVOL", r*16 + l)
};
