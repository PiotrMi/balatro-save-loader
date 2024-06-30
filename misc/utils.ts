import { writeFileSync, readFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import os from "os";
import path from "path";
// @ts-ignore: Could not find a declaration file for module
import { processFile, processJSON } from "../src/helpers/loading";
import { jokerHandCount } from "./types";
import jokersFile from "./jokers.json";
import { generateTypes } from "./utils/generateTypes";
import { usePreset } from "./presets";
import { Config } from "./types";

export type TJokersFile = typeof jokersFile;

export type UserSlot = 1 | 2 | 3;

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

const saveFileToJson = async (userSlot: UserSlot = 1, filename?: string) => {
  const dir = "__saves__";
  const json = readSaveFile(userSlot);
  const file = path.join(
    __dirname,
    dir,
    filename ?? `save-${new Date().toISOString()}.json`
  );
  writeFileSync(file, JSON.stringify(json, null, 2));
  await addJokersToJson(json);
  console.log(`✨ File added to: ${file} ✨`);
};

const jokersFromSave = (jsonSave) => {
  return jsonSave.cardAreas.jokers.cards;
};

const removeDuplicateJokers = (
  currentJokers: TJokersFile,
  jokersToAdd: TJokersFile
) => {
  const filteredJokers = [
    ...new Map(
      [...currentJokers, ...jokersToAdd].map((joker) => [joker.label, joker])
    ).values(),
  ];

  return filteredJokers;
};

const addJokersToJson = async (jsonSave: TJokersFile) => {
  try {
    const jokerJson = path.join(__dirname, "jokers.json");
    const file = await readFile(jokerJson, "utf8");
    const currentJokers = JSON.parse(file);
    const jokersToAdd = jokersFromSave(jsonSave);
    const newJokers = removeDuplicateJokers(currentJokers, jokersToAdd);

    const jokerNames = newJokers.map((joker) => joker.label);

    console.log(
      `✨ Current known Jokers: ${jokerNames.length + 1} :`,
      jokerNames
    );

    await generateTypes();

    await writeFile(jokerJson, JSON.stringify(newJokers, null, 2));
  } catch (error) {
    console.error(error);
  }
};

const baseJokerLimit = (
  jokersAdded: jokerHandCount,
  moreFreeSlots: number = 5
) => Object.values(jokersAdded).reduce((a, b) => a + b, 0) + moreFreeSlots;

function updateSave({ preset, userSlot, options }: Config) {
  const saveFile = readSaveFile(userSlot);
  usePreset(saveFile, preset, options);
  writeSaveFile(saveFile, userSlot);
}

export {
  readSaveFile,
  writeSaveFile,
  baseJokerLimit,
  saveFileToJson,
  addJokersToJson,
  jokersFromSave,
  updateSave,
};
