import { parseArgs } from "util";
import {
  readSaveFile,
  addJokersToJson,
  saveFileToJson,
  updateSave,
} from "./utils";
import { config } from "./config";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    buildHand: { type: "boolean" },
    updateJokers: { type: "boolean" },
    downloadSave: { type: "boolean" },
  },
  allowPositionals: true,
  strict: true,
});

if (values.buildHand) {
  updateSave(config);
}

if (values.downloadSave) {
  saveFileToJson();
}

if (values.updateJokers) {
  addJokersToJson(readSaveFile(1));
}
