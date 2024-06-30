import { writeFile } from "fs/promises";
import path from "path";

import { JOKER_NAMES } from "../jokers";

const types = `
  export type Joker = ${JOKER_NAMES.map((joker) => `"${joker}"`).join(" | ")};
`;

export async function generateTypes() {
  await writeFile(path.join(__dirname, "..", "types", "jokers.ts"), types);
  console.log("✨ Types generated! ✨");
}
