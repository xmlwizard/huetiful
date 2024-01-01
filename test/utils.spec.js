import * as utils from "../source/lib/huetiful.esm.mjs";

/** 
 * @license
 * utils.ts - Test suite for huetiful-js utils module. 
Copyright 2023 Dean Tarisai.
This file is licensed to you under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

it(`should get the passed in color's hue family`, function () {
  const colors = [
    ["rgb", 60, 79, 165],
    "ffce33",
    { j: 0.1105, c: 0.18, h: 163, mode: "jch" },
    679000,
  ];
  const hues = colors.map((el) => utils.getHueFamily(el));
  expect(hues).toBe(colors);
});
