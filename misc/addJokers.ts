import { addJokersToJson } from "./utils";
import { readSaveFile } from "./utils";

addJokersToJson(readSaveFile(1));
