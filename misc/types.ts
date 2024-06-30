import JOKERS from "./jokers.json";
import { Preset, Options } from "./presets";
import { UserSlot } from "./utils";
import { Joker } from "./types/jokers";

export type Config = {
  userSlot: UserSlot;
  preset: Preset;
  keepCurrentJokers?: boolean;
  jokerType?: {
    negative?: boolean;
    eternal?: boolean;
  };
  options?: Options;
};

export type JokerConfig = (typeof JOKERS)[keyof typeof JOKERS];
export type jokerHandCount = {
  [key in Joker]?: number;
};
export type JokerAbility = {
  negative?: boolean;
  eternal?: boolean;
};
