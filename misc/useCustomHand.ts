import fs from "fs";
import os from "os";
import path from "path";
import {
  decompress,
  processFile,
  processJSON,
  // @ts-ignore
} from "../src/helpers/loading.js";
import { JOKERS } from "./jokers";
import type { JokerConfig, JokerName } from "./jokers";

const DEBUG = false;

type JokerHand = {
  [key in JokerName]?: number;
};

const JOKERS_TO_ADD: JokerHand = {
  dna: 5,
  hack: 2,
  spaceJoker: 5,
  hiker: 5,
  showman: 1,
  burntJoker: 5,
  fibonacci: 2,
};
const totalJokers = Object.values(JOKERS_TO_ADD).reduce((a, b) => a + b, 0);
const JOKER_HAND_LIMIT = totalJokers + 5;

const MAC_PATH = (userSlot = 1, fileName = "save.jkr") =>
  `/Users/${
    os.userInfo().username
  }/Library/Application Support/Balatro/${userSlot}/${fileName}`;

const PATH = path.resolve(MAC_PATH());

const file = fs.readFileSync(PATH);
const arrayBuffer = new Uint8Array(file).buffer;
const json = processFile(arrayBuffer);

// game config
json.GAME.dollars = 4;
json.cardAreas.jokers.config.card_limit = JOKER_HAND_LIMIT;
json.cardAreas.jokers.config.temp_limit = JOKER_HAND_LIMIT;
json.cardAreas.consumeables.config.card_limit = 100;
json.cardAreas.hand.config.card_limit = 20;
json.GAME.round_resets.discards = 5;
json.GAME.round_resets.hands = 5;
json.GAME.round_resets.reroll_cost = 0;

function knownJoker(joker: JokerName) {
  return Object.keys(JOKERS).includes(joker);
}

function addJoker(joker: JokerName) {
  if (!knownJoker(joker)) new Error(`Not implemented joker: ${joker}`);
  return JOKERS[joker];
}

function generateJokers(jokers: JokerHand) {
  const jokerArray = Object.entries(jokers).map(([joker, amount]) => {
    if (knownJoker(joker as JokerName)) {
      return Array(amount).fill(addJoker(joker as JokerName));
    }
  });

  const data = jokerArray
    .flat()
    .filter((joker) => joker !== undefined)
    .map((joker: JokerConfig, index) => {
      return {
        ...joker,
        rank: index + 1,
      };
    });
  return data;
}

json.cardAreas.jokers.cards = generateJokers(JOKERS_TO_ADD);

if (!DEBUG) {
  const newBuffer = processJSON(json);
  fs.writeFileSync(PATH, newBuffer);
  console.log("Done!");
}
