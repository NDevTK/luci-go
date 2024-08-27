# LUCI Test Single UI
LUCI Test Single UI is the web UI for all LUCI Test systems.

## Local Development Workflows
### Prerequisites
You need to run the following commands to setup the environment.
```sh
# Activate the infra env (via the infra.git checkout):
cd /path/to/infra/checkout
eval infra/go/env.py

# Install the dependencies.
cd /path/to/this/directory
npm ci
```

### Start a local AppEngine server
TODO: add instructions

For the simple case of testing an rpc using `/rpcexplorer`:
```
go run main.go -cloud-project luci-milo-dev -auth-service-host chrome-infra-auth-dev.appspot.com
```

### Start a local UI server
To start a [Vite](https://vitejs.dev) local dev server, run
```
npm run dev
```

The local dev server only serves the SPA assets. It sends pRPC and HTTP REST
requests to staging servers (typically hosted on GCP). Check
[.env.development](.env.development) for instructions to configure the target
servers and other local development settings.


#### Login on a local UI server
When developing with a local UI server, the login flow is different from a
deployed version. Click the login button and you should see the instruction.

### Deploy a demo to GAE dev instance
This deploys your local code to GAE as a dev instance that uses real auth
and can be accessed by other people.

```sh
cd luci/milo/ui # or `cd luci/milo`.
make up-dev
```

Alternatively, you can deploy the demo using the following commands.
```sh
cd luci/milo/ui
npm ci # if you haven't installed/updated the dependencies.
make deploy-ui-demo
```

`make deploy-ui-demo` is faster than `make up-dev`. However,
1. it does not install npm dependencies. You need to ensure they are installed
   and up-to-date yourselves. And,
2. the deployed UI demo will always send pRPC requests to
   `staging.milo.api.luci.app`. If your demo includes pRPC changes, use
   `make up-dev` instead.

If you use `gae.py` to deploy, you need to deploy all services at least once.
Otherwise, the browser code will try to call a dev API that doesn't exist.
```sh
cd luci/milo/ui
npm run build
# Both the `api`, and `default` service should be uploaded at least once.
gae.py upload -p ../ -A luci-milo-dev
# After that, you can deploy `default` only for shorter deployment time, if
# there's no code changes to the API service.
gae.py upload -p ../ -A luci-milo-dev default
```

### Add a new npm package
You can use [npm install](https://docs.npmjs.com/cli/v8/commands/npm-install) to
add a new npm package.

LUCI Test Single UI uses a private npm registry (defined in [.npmrc](.npmrc)).
By default, it rejects packages that are less than 7 days old (with an
HTTP 451 Unknown error).

You can avoid this issue by temporarily switching to the public npm registry
with the following steps.

 1. comment out the registry setting in [.npmrc](.npmrc), then
 2. install the package, then
 3. replace the registry in all the URLs in the "resolved" field in
 [package-lock.json](package-lock.json) with the private registry, then
 4. uncomment the registry setting in [.npmrc](.npmrc), then
 5. wait 7 days before submitting your CL.

### Others
Check the [Makefile](Makefile), the [parent Makefile](../Makefile), and the
`"scripts"` section in [package.json](package.json) for more available commands.

## Design Decisions
### Service Workers
To improve the loading time, the service workers are added to
 * redirect users from the old URLs to the new URLs (e.g. from
   `` `/b/${build_id}` `` to `` `/ui/b/${build_id}` ``) without hitting the
   server, and
 * cache and serve static assets, including the entry file (index.html), and
 * prefetch resources if the URL matches certain pattern.

It's very hard (if not impossible) to achieve the results above without service
workers because most page visits hit a dynamic (e.g.
`` `/p/${project}/...` ``), and possibly constantly changing (e.g.
`` `/b/${build_id}` ``) URL path, which means cache layers that rely on HTTP
cache headers will not be very effective.

### [Src Directory](./src) Structure
#### Goals
The directory structure is designed to achieve the following goals:
 * Fit to host all LUCI Single UI projects.
 * Discovering/locating existing modules should be straightforward.
 * Deciding where a new module should be placed should not be confusing.
 * Managing (first party) modules dependencies should be straightforward, which
   requires
   * making the dependency relationship between modules more obvious, and
   * making it harder to accidentally introducing circular dependencies.
 * Support different levels of encapsulation, which includes the abilities to
   * limit the surface of a module, and
   * enforce module-level invariants.

#### Rules
To achieve those goals, the [./src](./src) directory are generally structured
with the following rules:
 * Modules are grouped into packages. Packages are all located at the top level
   directory in the ./src directory. It can be one of the followings:
   * A business domain package (e.g. [@/build](./src/build),
     [@/bisection](./src/bisection)).
     * The contained modules are specific to the business domain.
     * The business domain typically matches a top-level navigation/feature
       area.
     * A domain package may import from another domain package
       * This is supported so natural dependencies between domains can be
         expressed (e.g. builds depends on test results).
       * The usage should still be limited. Consider lifting the shared module
         to the @/common package.
       * Circular dependencies between domain packages must be avoided.
     * Grouping modules by business domains makes enforcing encapsulation/
       isolation easier.
     * Placing modules under a package named after their domain helps
       discovering/locating modules as the project grows larger.
   * The [@/common](./src/common) package.
     * The contained modules can have business/application logic.
     * The contained modules must not make assumptions on the business domains
       it's used in.
     * The contained modules should be reusable across business domains.
     * Must not import from domain packages.
     * This helps capturing modules that cross domains.
     * The name gives a clear signal that the modules should stay reusable.
   * The [@/generic_libs](./src/generic_libs) package.
     * The contained modules must not contain any business logic.
     * The contained modules should be highly generic and reusable (akin to a
       published module).
     * The contained modules (excluding unit tests) must not depend on any first
       party module outside of [@/generic_libs](./src/generic_libs).
     * Comparing to @/common, [@/generic_libs](./src/generic_libs) must not
       contain business/application logic.
     * The name gives a clear signal that the modules should stay generic.
     * Separating from @/common makes it harder to accidentally
       add business logic to a generic module.
   * The [@/core](./src/core) package.
     * The contained modules are for core functionality such as login or
       the landing page.
   * The [@/testing_tools](./src/testing_tools) package.
     * Contains utilities for writing unit tests.
     * Can import from other packages or be imported to other packages.
     * Must only be used in unit tests.
     * Other directories may have their own `./testing_tools` subdirectory to
       contain testing tools specific to those domains.
     * It helps separating test utilities from production code.
 * Modules are usually further divided into groups by their functional category
   (e.g. `./components/*`, `./hooks/*`, `./tools/*`).
   * The purpose is to make locating/discovering existing modules easier as the
     module list grows larger.
   * The divide is purely aesthetical.
     * There's no logical boundary between those groups and the division does
       not signal or enforce encapsulation.
     * It's perfectly fine to have "circular imports" between groups since they
       are merely aesthetical groups.
     * Circular dependencies between the actual underlying modules should still
       be avoided.
   * This rule is enforced loosely.
     * Modules belong to multiple functional categories can simply pick a group
       with the best fit (e.g. a module that exports React components, hooks and
       utility functions may simply be placed under `./components/`).
     * Modules that don't fit any of the categories may be placed directly in
       the parent directory or in a catch all group (e.g. `./tools/`). This
       should be used sparingly.
 * Modules may declare entry files (e.g. `index.ts`) that reexport symbols.
   Symbols reexported by the entry file are considered the public surface of the
   module, while other symbols are considered internal to the module (i.e. no
   deep imports when there's an entry file).
   * This helps reducing the public surface of a module. Makes it easier to
     implement encapsulation and enforce invariants.
 * Modules can themselves have different internal structures to implement
   different layers of encapsulation.
 * Contexts, providers and hooks are defined as such:
   * `context.[ts/tsx]` file that contains the context declaration and the provider.
   * `hooks.ts` file that contains the hooks that are used to access
     or perform actions on the context.
   * In case where the provider depends on hooks from the same context,
     then the provider and the context need to be further split
     into `providers.tsx` and `context.ts` files.
   * If the directory only represents a context, such as to describe a global context,
     then there is no need to create a separate directory to host the context and the hooks,
     check `synced_search_params` as an example.

Note: At the moment (2023-09-14), some packages are in an inconsistent state.
Some modules should be moved to other packages. Notable items include but not
limited to
 * Some modules in @/common should be moved to business domain packages.
 * [@/bisection](./src/bisection) and other recently merged in projects should
   have common modules lifted to @/common.

#### Graph illustration of the package relationships:
```ascii
@/core                    ─┬─> @/build                        ─┬─> @/common           ─┬─> @/generic_libs
  ├─■ ./pages             │     ├─■ ./pages                   │     ├─■ ./components  │     ├─■ ./components
  ├─■ ...other groups...  │     ├─■ ./components              │     ├─■ ./hooks       │     ├─■ ./hooks
  ├─■ ...entry files...   │     ├─■ ./hooks                   │     ├─■ ./tools       │     ├─■ ./tools
  └─■ ...                 │     ├─■ ./tools                   │     └─■ ...           │     └─■ ...
                          │     └─■ ...                       │                       │
                          │                                   │                       ├─> ...third party libs...
                          ├─> @/bisection                    ─┤                       │
                          │     ├─■ ./pages                   │                       │
                          │     ├─■ ./components              │                       │
                          │     ├─■ ./hooks                   │                       │
                          │     ├─■ ./context                 │                       │
                          │     ├─■ ./tools                   │                       │
                          │     └─■ ...                       │                       │
                          │                                   │                       │
                          ├─> @/analysis                     ─┤                       │
                          │     └─■ ...                       │                       │
                          │                                   │                       │
                          ├─> @/...other business domains... ─┤                       │
                          │     └─■ ...                       │                       │
                          │                                   │                       │
                          └─> ────────────────────────────────┴─> ────────────────────┘

A ─> B: A depends on B.
A ─■ B: A contains B.
```
