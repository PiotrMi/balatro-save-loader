import { JokerHand, generateJokers } from "./jokers";
import { baseJokerLimit } from "./utils";

type Options = {
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

const setGameSettings = (saveFile, options: Options = DEFAULT_OPTIONS) => {
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

const upgradingHand = (saveFile, options?: Options) => {
  const jokers: JokerHand = {
    hiker: 2,
    dna: 2,
    spaceJoker: 4,
  };
  const optionsWithJokers = {
    ...options,
    jokerLimit: baseJokerLimit(jokers),
  };
  setGameSettings(saveFile, optionsWithJokers);
  saveFile.cardAreas.jokers.cards = generateJokers(jokers);
};

type Preset = "upgradingHand" | "default";

const usePreset = (saveFile, preset?: string) => {
  switch (preset) {
    case "upgradingHand":
      upgradingHand(saveFile);
      break;
    default:
      setGameSettings(saveFile);
      break;
  }
};

export { setGameSettings, upgradingHand, usePreset };
