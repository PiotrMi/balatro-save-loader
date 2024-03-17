import { readSaveFile, writeSaveFile } from "./utils.js";
import { usePreset } from "./presets.js";

const USER_SLOT = 1;
const SAVE_FILE = readSaveFile(USER_SLOT);

usePreset(SAVE_FILE, "upgradingHand");

writeSaveFile(SAVE_FILE, USER_SLOT);
