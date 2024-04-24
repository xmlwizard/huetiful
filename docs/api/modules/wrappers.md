[huetiful-js](../README.md) / wrappers

# Module: wrappers

## Classes

- [Color](../classes/wrappers.Color.md)
- [ColorArray](../classes/wrappers.ColorArray.md)

## Functions

### color

▸ **color**(`color`): [`Color`](../classes/wrappers.Color.md)

Wrapper function over the Color class that returns a new Color method chain.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | [`ColorToken`](alpha.md#colortoken) | The color token to bind. |

#### Returns

[`Color`](../classes/wrappers.Color.md)

A `new Color` class with all the utilities that take a single color as the first parameter bound to its prototype.

**`Example`**

```ts
import { color } from 'huetiful-js'

let wrapper = color('cyan').getHueFamily()
 // 'blue-green'
```

#### Defined in

[src/wrappers.js:862](https://github.com/prjctimg/huetiful/blob/ed00af0/src/wrappers.js#L862)

___

### load

▸ **load**(`colors`): [`ColorArray`](../classes/wrappers.ColorArray.md)

A wrapper function over the `ColorArray` class which returns a new instance of the class. Use it to invoke the class without using the `new` keyword

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `colors` | `Collection` | A collection of colors to chain the array methods on. Every element in the array will be parsed as a color token. |

#### Returns

[`ColorArray`](../classes/wrappers.ColorArray.md)

A new instance of the `ColorArray` class with the passed in collection bound to it.

#### Defined in

[src/wrappers.js:169](https://github.com/prjctimg/huetiful/blob/ed00af0/src/wrappers.js#L169)