import { generateJokers } from "./jokers";
import { jokerHandCount } from "./types";
import { baseJokerLimit } from "./utils";

export type Options = {
  dollars?: number;
  jokerLimit?: number;
  consumableLimit?: number;
  handLimit?: number;
  discards?: number;
  hands?: number;
  rerollCost?: number;
};

const DEFAULT_OPTIONS: Options = {
  dollars: 4,
  jokerLimit: 5,
  consumableLimit: 2,
  handLimit: 8,
  discards: 3,
  hands: 4,
  rerollCost: 5,
};

const setGameSettings = (saveFile: any, options: Options = DEFAULT_OPTIONS) => {
  saveFile.GAME.dollars = options.dollars ?? DEFAULT_OPTIONS.dollars;
  saveFile.cardAreas.jokers.config.card_limit =
    options.jokerLimit ?? DEFAULT_OPTIONS.jokerLimit;
  saveFile.cardAreas.jokers.config.temp_limit =
    options.jokerLimit ?? DEFAULT_OPTIONS.jokerLimit;
  saveFile.cardAreas.consumeables.config.card_limit =
    options.consumableLimit ?? DEFAULT_OPTIONS.consumableLimit;
  saveFile.cardAreas.hand.config.card_limit =
    options.handLimit ?? DEFAULT_OPTIONS.handLimit;
  saveFile.GAME.round_resets.discards =
    options.discards ?? DEFAULT_OPTIONS.discards;
  saveFile.GAME.round_resets.hands = options.hands ?? DEFAULT_OPTIONS.hands;
  saveFile.GAME.round_resets.reroll_cost =
    options.rerollCost ?? DEFAULT_OPTIONS.rerollCost;
};

const baseHand = (saveFile: any, jokers: jokerHandCount, options?: Options) => {
  const optionsWithJokers = {
    ...options,
    jokerLimit: baseJokerLimit(jokers),
  };
  setGameSettings(saveFile, optionsWithJokers);
  saveFile.cardAreas.jokers.cards = generateJokers(jokers);
};

const legendaryHand = (saveFile: any, options?: Options) => {
  baseHand(
    saveFile,
    {
      perkeo: 1,
      dna: 2,
      hiker: 2,
      yorick: 1,
    },
    options
  );
};

const goodStart = (saveFile: any, options?: Options) => {
  baseHand(
    saveFile,
    {
      showman: 1,
      dna: 2,
      hack: 2,
      hiker: 2,
      "wee joker": 2,
    },
    options
  );
};

const upgradingHand = (saveFile: any, options?: Options) => {
  const jokers: jokerHandCount = {
    hiker: 4,
  };
  baseHand(saveFile, jokers, options);
};

const repeaterHand = (saveFile: any, options?: Options) => {
  const jokers: jokerHandCount = {
    hack: 5,
    fibonacci: 5,
    hiker: 5,
    dna: 4,
  };
  baseHand(saveFile, jokers, options);
};

const spaceJokerOnly = (saveFile: any, options?: Options) => {
  const jokers: jokerHandCount = {};
  baseHand(saveFile, jokers, options);
};

export type Preset =
  | "upgradingHand"
  | "repeaterHand"
  | "spaceJokerOnly"
  | "goodStart"
  | "legendaryHand"
  | "default";

const usePreset = (
  saveFile: any,
  preset: Preset,
  options?: Options,
  keepOriginalJokers?: boolean
) => {
  switch (preset) {
    case "upgradingHand":
      upgradingHand(saveFile, options);
      break;
    case "repeaterHand":
      repeaterHand(saveFile, options);
      break;
    case "spaceJokerOnly":
      spaceJokerOnly(saveFile, options);
      break;
    case "goodStart":
      goodStart(saveFile, options);
      break;
    case "legendaryHand":
      legendaryHand(saveFile, options);
      break;
    default:
      setGameSettings(saveFile, options);
      break;
  }
};

export { setGameSettings, upgradingHand, usePreset };
