import { contrast, deficiency } from "../lib/accessibility.ts";
import { default as runner, type Spec } from "./runner.ts";

const specs: Spec[] = [
  {
    description: "Calculates the contrast between two colors",
    matcher: "equalTo",
    params: ["blue", "red"],
    callback: contrast,
    result: 0,
  },
  {
    description: "Simulates color vision deficiency",
    matcher: "equalTo",
    params: ["cyan", { kind: "green", severity: 0.6 }],
    callback: deficiency,
    result: 0,
  },
];

runner(specs);
