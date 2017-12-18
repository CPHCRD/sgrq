![https://travis-ci.org/cphcrd/sgrq.svg](https://travis-ci.org/cphcrd/sgrq.svg)

# SGRQ

St. George’s Respiratory Questionnaire application for COPD patients

* * *


## Getting Started

If you are interested in testing out the application you can download the latest pre-built package version for Windows, Mac and Linux on [sgrq.github.io](http://sgrq.github.io).

All previous versions can be found under the [release section](https://github.com/cphcrd/sgrq/releases) of this repository.

If you are interested in contributing or building the application yourself follow the instructions:

### Prerequisities

In order to build the application you need to install a stable version of [Node.js](https://nodejs.org/en/).

If you want to clone and contribute to the project you should to install [Git](https://git-scm.com/).

### Installing

First clone or download this repository running in your terminal:

```
git clone https://github.com/cphcrd/sgrq.git
```

then navigate to the root folder of the project:

```
cd sgrq
```

and run:

```
npm install
```

NPM will download all the required dependencies to build the project. A first build will be triggered.

## Running the application

To test the project run in your terminal:

```
npm start
```

that will launch the a `Webpack` build process. The process will:

- Serve the project on the URL [http://localhost:3000/](http://localhost:3000/)
- Trigger a re-build of the sources on file modification.

To test the project in the `Electron` environment run:

```
npm run electron
```

## Running the tests

To test the project on `Phantomjs` run in your terminal:

```
npm run test
```

To test it in an `Electron` environment run:

```
npm run test:electron
```


## Building the application

You can build only the sources running:

```
npm run build:prod
```

or build the application binaries running:

```
npm run build:electron
```


## Built With

* [Electron](https://github.com/electron/electron)
* [Webpack](https://github.com/webpack/webpack)
* [Babel](https://github.com/babel/babel)
* [Browserify](https://github.com/substack/node-browserify)


## Contributing

You can directly create a pull request for this repository. Your code will be tested by [Travis CI](https://travis-ci.org/cphcrd/sgrq).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/cphcrd/sgrq/tags).


## Bug reports

Please declare found bugs on the [issues section](https://github.com/cphcrd/sgrq/issues) of the repository.

## Authors

* Marco Gelpi, MD
* Jonathan Argentiero, Developer and maintainer
* Andreas Ronit, MD

See also the list of [contributors](https://github.com/cphcrd/sgrq/contributors) who participated in this project.

## License

This application is free for use. You can copy and redistribute it as you wish.
