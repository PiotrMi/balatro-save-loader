import { Preset, Options } from "./presets";
import { UserSlot } from "./utils";

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
