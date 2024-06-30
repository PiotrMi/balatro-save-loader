import JOKERS from "./jokers.json";
import { JokerAbility, jokerHandCount } from "./types";
import { Joker } from "./types/jokers";

export const JOKER_NAMES = JOKERS.map((joker) => joker.label.toLowerCase());

function knownJoker(joker: Joker) {
  return JOKER_NAMES.includes(joker.toLowerCase());
}

function addJoker(joker: Joker, options?: JokerAbility) {
  if (!knownJoker(joker)) {
    console.error(`Not implemented joker: ${joker}`);
    return;
  }
  return JOKERS.find((j) => j.label.toLowerCase() === joker.toLowerCase());
}

export function generateJokers(jokers: jokerHandCount, options?: JokerAbility) {
  const jokerArray = Object.entries(jokers).map(([joker, amount]) => {
    if (knownJoker(joker as Joker)) {
      return Array(amount).fill(addJoker(joker as Joker));
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
