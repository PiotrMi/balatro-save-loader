import { readSaveFile, writeSaveFile } from "./utils";
import { usePreset } from "./presets";
import { Config } from "./types";

const config: Config = {
  userSlot: 1,
  preset: "upgradingHand",
  options: {
    dollars: 25,
  },
};

// TODO: handle rest of Config
function updateSave({ preset, userSlot, options }: Config) {
  const saveFile = readSaveFile(userSlot);
  usePreset(saveFile, preset, options);
  writeSaveFile(saveFile, userSlot);
}

updateSave(config);
