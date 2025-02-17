import { token } from "./utils.ts";
import {
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  filterGrayscale,
  formatHex8,
} from "culori/fn";
import { eq, or } from "./internal.ts";
import { wcagContrast } from "culori/fn";
import type { ColorToken, DeficiencyOptions } from "./types.d.ts";

/**
 * Gets the contrast between the passed in colors.
 *
 * :::tip
 *
 * Swapping color `a` and `b` in the parameter list doesn't change the resulting value. The maximum value is 21 (or the contrast between black and white).
 *
 * :::
 *
 * @param  a First color to query. The default is `white`.
 * @param  b The color to compare against. The default is `black`.
 * @example
 *
 * import { contrast } from 'huetiful-js'
 *
 * console.log(contrast("blue", "red"));
 * // 21
 */
function contrast(
  a: ColorToken = "white",
  b: ColorToken = "black",
): number {
  // @ts-ignore:
  return wcagContrast(token(a), token(b));
}

/**
 * Simulates how a color may be perceived by people with color vision deficiency.
 *
 * :::tip
 *
 * To avoid writing the long types, the expected parameters for the `kind` of blindness are simply the colors that are hard to perceive for the type of color blindness:
 *
 *  * `'monochromacy'` - An inability to see color, only perceiving shades of gray. The `kind` is `mono`.
 *
 * * `'tritanopia'` - An inability to distinguish the color 'blue'. The `kind` is `'blue'`.
 * * `'deuteranopia'` - An inability to distinguish the color 'green'.. The `kind` is `'green'`.
 * * `'protanopia'` - An inability to distinguish the color 'red'. The `kind` is `'red'`.
 *
 * :::

 * @param  color The color to return its simulated variant. The default is `cyan`.
 * @param  options The optional overrides for tweaking the final output.
 * @example
 *
 * import { deficiency } from 'huetiful-js'

// Here we are simulating color blindness of tritanomaly or we can't see 'blue'.
// We are passing in our color as an array of channel values in the mode "rgb". The severity is set to 0.5

console.log(deficiency(['rgb', 230, 100, 50, 0.5],{ kind:'blue', severity:0.5 }))
// '#dd663680'

 */
function deficiency(
  color: ColorToken = "cyan",
  options: DeficiencyOptions = {
    kind: "red",
    severity: 0.5,
  },
): ColorToken {
  let { kind, severity } = options || {};

  const func = (c: string, t = 1) =>
      ({
        // @ts-ignore:
        blue: filterDeficiencyTrit(t)(c),
        // @ts-ignore:
        red: filterDeficiencyProt(t)(c),
        // @ts-ignore:
        green: filterDeficiencyDeuter(t)(c),
        monochromacy: filterGrayscale(t, "lch")(c),
      })[kind as string],
    defs = ["red", "blue", "green", "mono"];

  kind = or(kind, "red");
  severity = or(severity, 0.5);
  // @ts-ignore:
  return defs.some((el) => eq(el, kind?.toLowerCase()))
    // @ts-ignore:
    ? formatHex8(func(token(color), severity))
    : Error(
      `Unknown color vision deficiency ${kind}. The options are the strings 'red' | 'blue' | 'green' | 'monochromacy'`,
    );
}

export { contrast, deficiency };
