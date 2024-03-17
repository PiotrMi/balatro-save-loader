import { writeFileSync, readFileSync } from "fs";
import os from "os";
import path from "path";
// @ts-ignore: Could not find a declaration file for module
import { processFile, processJSON } from "../src/helpers/loading";
import { JokerHand } from "./jokers";

type UserSlot = 1 | 2 | 3;

const macPath = (userSlot: UserSlot = 1) =>
  `/Users/${
    os.userInfo().username
  }/Library/Application Support/Balatro/${userSlot}/save.jkr`;

const FULL_PATH = (userSlot: UserSlot) => path.resolve(macPath(userSlot));

const readSaveFile = (userSlot: UserSlot) => {
  const file = readFileSync(FULL_PATH(userSlot));
  const arrayBuffer = new Uint8Array(file).buffer;
  const json = processFile(arrayBuffer);
  return json;
};

const writeSaveFile = (json, userSlot: UserSlot) => {
  writeFileSync(FULL_PATH(userSlot), processJSON(json));
  console.log("✨ Save file updated! ✨");
};

const baseJokerLimit = (jokersAdded: JokerHand, moreFreeSlots: number = 5) =>
  Object.values(jokersAdded).reduce((a, b) => a + b, 0) + moreFreeSlots;

export { readSaveFile, writeSaveFile, baseJokerLimit };
