# Building from source

You can compile to JS from source locally on your machine if you wish. I don't
upload a `dist/` directory because the library is published using GitHub
Actions.

## System requirements

- bun 1.x
- deno (optional for running tests)

Simply call the `bun` command with the `build.ts` file.

```sh
bun build.ts
```

You should see the following output if the build succeeds.

```sh
Cleaned build/ directory
Browser ESM (minified) entire library build complete🏗
Node build complete🏗
CLI Building entry: lib/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v8.3.5
DTS Build start
DTS ⚡️ Build success in 4216ms
DTS build/index.d.ts 60.77 KB
60K     build/browser
44K     build/node
64K     build/index.d.ts
```

### Running tests

The tests are run using `deno test`. You need to have Deno installed in order to
run tests.

Every publicly exported function has tests for it. Tests are grouped by module,
but some funcctions depend on other publicly exported functions which means one
error may cause other utils to fail too (not sure if its skill issues)

```sh
deno test
```

> The `wip` branch is usually broken but the `dev` branch has unstable but code
> ready for testing and passes the current assertions.
