import fs from "fs";
import os from "os";
import path, { join } from "path";
import {
  decompress,
  processFile,
  processJSON,
} from "../src/helpers/loading.js";
import { JOKERS } from "./jokers.js";

const MAC_PATH = (userSlot = 1, fileName = "save.jkr") =>
  `/Users/${
    os.userInfo().username
  }/Library/Application Support/Balatro/${userSlot}/${fileName}`;

const PATH = path.resolve(MAC_PATH());

// joker: amount
const JOKERS_TO_ADD = {
  hack: 5,
  spaceJoker: 10,
  hiker: 10,
  dna: 5,
};
const totalJokers = Object.values(JOKERS_TO_ADD).reduce((a, b) => a + b, 0);
const JOKER_HAND_LIMIT = totalJokers + 5;

const file = fs.readFileSync(PATH);
const arrayBuffer = new Uint8Array(file).buffer;
const json = processFile(arrayBuffer);

// game config
json.GAME.dollars = 9999;
json.cardAreas.jokers.config.card_limit = JOKER_HAND_LIMIT;
json.cardAreas.jokers.config.temp_limit = JOKER_HAND_LIMIT;
json.cardAreas.consumeables.config.card_limit = 100;
json.cardAreas.hand.config.card_limit = 20;
json.GAME.round_resets.discards = 999;
json.GAME.round_resets.hands = 999;
json.GAME.round_resets.reroll_cost = 0;

function knownJoker(joker) {
  return Object.keys(JOKERS).includes(joker);
}

function addJoker(joker) {
  if (!knownJoker(joker)) new Error(`Not implemented joker: ${joker}`);
  return JOKERS[joker];
}

/**
 * Adds multiple jokers to the format.
 * @param {Object} { joker: string, amount: number } - An object containing the jokers and their amounts to add.
 * @returns {Object[]} - An array of objects representing the formatted jokers.
 */
function generateJokers(jokers) {
  // no sure if this is needed
  const stringIndex = (index) => `NOSTRING_${index}`;

  const jokerArray = Object.entries(jokers).map(([joker, amount]) => {
    if (knownJoker(joker)) {
      return Array(amount).fill(addJoker(joker));
    }
  });

  const data = jokerArray
    .flat()
    .filter((joker) => joker !== undefined)
    .map((joker, index) => {
      return {
        ...joker,
        rank: index + 1,
      };
    });
  return data;
}

json.cardAreas.jokers.cards = generateJokers(JOKERS_TO_ADD);

const newBuffer = processJSON(json);
fs.writeFileSync(PATH, newBuffer);

console.log("Done!");
