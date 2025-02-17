// @ts-nocheck:

import { expect } from "jsr:@std/expect";

export type Spec = {
  description: string;

  callback: unknown;
  params: unknown[];
};
export default function (specs: Spec[]) {
  for (const spec of specs) {
    console.info(
      `${spec.description} \n`,
      spec?.callback(...spec.params),
      "\n",
    );
    Deno.test(
      spec.description ||
        "Running test...",
      () => {},
    );
  }
}
