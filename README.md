# xComponent.js

Light HTML Custom Elements creation with lifecycle, renderEngine and eventManager.

## Table of Contents

1.  [Documentation](#documentation)
    1.  [Installation](#installation)
    2.  [Examples](#examples)
    3.  [Methods](#methods)
    4.  [Objects](#objects)
2.  [Known issues](#issues)
3.  [Contributing](#contributing)
4.  [License](#license)

## Goal and Philosophy

**`xComponent.js`** xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx [Node.js](https://nodejs.org/) xxxxxxxxxxxxxxxxxxxxxxxx

**`xComponent.js`** xxxxxxxxxxxx

- xxxxx _xxxxxxx_
- _xxx xxxx_
- _xxxxxx_ xxxxx
- _xxxxx_ xxxxxx
- xxxxxxx _xxxxxx xxxxxx_

> **Note:** **`xComponent.js`** provides xxxxxxx xxxxxxxxxxxx xxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxx
xxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxx xxxxxxxxxxxxxx xxxxxxxxxxxxxx xxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxx xxxxxxx.

## [Documentation](#documentation)

<a name="documentation"></a>

### Installation

<a name="installation"></a>

```shell
npm install xcomponent
```

```javascript
import xComponent from 'xComponent'

```

<a name="examples"></a>

### Examples (Run it and see it)

Check out ...

### Methods

<a name="methods"></a>

#### `init(localScope)`

Launch the prompt interface (inquiry session)

- **questions** (Array) containing [Question Object](#question) (using the [reactive interface](#reactive-interface), you can also pass a `Rx.Observable` instance)
- **answers** (object) contains values of already answered questions. Inquirer will avoid asking answers already provided here. Defaults `{}`.
- returns a **Promise**

#### `render(x)`

Register prompt plugins under `name`.

- **name** (string) name of the this new prompt. (used for question `type`)
- **prompt** (object) the prompt object itself (the plugin)

#### `behavior(Event)`

Create a self contained inquirer module. If you don't want to affect other libraries that also rely on inquirer when you overwrite or add new prompt types.

```js
var prompt = inquirer.createPromptModule();

prompt(questions).then(/* ... */);
```

### Objects

<a name="objects"></a>

#### Event

## Known issues

<a name="issues"></a>

...

## Contributing

<a name="contributing"></a>

**Unit test**
Unit test are written in [Mocha](https://mochajs.org/). Please add a unit test for every new feature or bug fix. `npm test` to run the test suite.

**Documentation**
Add documentation for every API change. Feel free to send typo fixes and better docs!

## License

<a name="license"></a>

Copyright (c) 2021 Louis-Antoine Lumet (twitter: [@Mudryy_121](https://twitter.com/Mudryy_121))
Licensed under the MIT license.
