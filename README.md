# NEWSTART web

## Folder Structure
```
├── README.md
├── babelrc
├── icons
├── node_modules
├── package.json
├── public/
├── pages
├── src/
│   ├── auth
│   ├── configs
│   ├── modules/
|       ├── _core /
|           ├── bits
|           ├── components
|       ├── other pages
│   ├── state/
|       ├── app
|       ├── constants
|       ├── models
|       ├── reducers/
|           ├──  all reducers folder
│   ├── styles
│   ├── types
│   └── utils
├── tsconfig.json
└── yarn.lock
```

## ClassName
- BEM pattern

## Folder name
- camel case
eg: MyFolder

## Variable name
- snake case
eg: var : my_var

## State Management

- Redux:
  - `src/app` folder contains all helper for the state
  - `src/state` folder contains all the redux toolkit
    `slices`, some called it features as well.

## Development server
  - clone the repo
  - [Setup credential for @newstart-online/sdk](https://github.com/newstart-online/sdk#use-newstart-onlinesdk-package)
  - `cd` to app directory
  - run `yarn` or `yarn install`
  - finally, run `yarn dev`

## Note
  - **Before commit**:
    - It run `yarn format`, `yarn lint` , and `yarn check-types`  to ensure proper format, lint and typescript type issue
  - **Before push to remote**:
    - It run `yarn build` to ensure whether application build successfully or not

