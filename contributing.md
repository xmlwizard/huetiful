# Contributing 💙

Thank you :smile: for contributing to
[huetiful-js](https://github.com/prjctimg/huetiful)!

On this page you'll find information on how to setup the project and navigate
the file structure.

The project structure is as follows:

- `www/` - Where the documentation site lives
- `lib/` - This is where the source code is located
- `tests/` This is where the test files for the publicly accessible symbols
  live.

## Requirements

- Supported version of Node (LTS or higher)
- git
- bun (for building bundles)
- deno (for tests)

## Setup⛳

To quickly get the development environment ready you can run the following
command, you can replace `npm` with any package manager :

```sh
git clone https://github.com/prjctimg/huetiful && cd huetiful 

# Package manager of your choice
bun install
```

## Documentation

The API documentation is written as JSDoc comments and is compiled from the
source files using [TypeDoc][typedoc] and
[typedoc-plugin-markdown][markdown-plugin].

The site is generated using [Docusaurus](https://docusaurus.io) which gets its
markdown source from Typedoc using the typedoc-plugin-markdown

You can edit the other pages by going to the `www/docs/` directory.

## Adding/Running tests 🧪

```sh
bun test
```

Each module with publicly exported symbols has a corresponding `*.test.ts` file.
The specs are defined as an object with the following structure:

```ts
export type Spec = {
  description?: string;
  callback: any;
  params: any[];
};
```

Note that none of the field is optional

### Pull Requests

1. Fork the project
2. Clone your fork
3. Create a pr/**feature** branch replacing **feature** with what you're working
   on.

Happy hacking 🚀!

[typedoc]: [https://npmjs.com/package/typedoc]
[markdown-plugin]: [https://npmjs.com/package/typedoc-plugin-markdown]
