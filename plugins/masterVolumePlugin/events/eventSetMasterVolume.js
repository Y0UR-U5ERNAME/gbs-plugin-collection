export const id = "EVENT_SET_MASTER_VOL";
export const name = "Set Master Volume";
export const groups = ["EVENT_GROUP_MUSIC"];

export const autoLabel = (fetchArg, args) => {
  return "Set Master Volume To " + fetchArg("volume")
};

export const fields = [
  {
    key: "volume",
    type: "slider",
    min: 0,
    max: 39,
    defaultValue: 0,
  },
  {
    label: "Note that setting the volume to 0 will not mute the volume.",
  },
];

export const compile = (input, helpers) => {
  const { _addCmd } = helpers;
  const {volume} = input;
  
  _addCmd("VM_SOUND_MASTERVOL", volume)
};