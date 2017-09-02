# pwc-address-book-ui

UI frontend for a simple address book implemented for the PwC interview process.

This is a simple frontend sitting in front of the [`pwc-address-book-api`](https://github.com/somada141/pwc-address-book-api) Python API. It was built primarily on [`NodeJS`](https://nodejs.org/en/) and [`AngularJS`](https://angularjs.org/) v1.6.

This project was generated with [`yeoman`](http://yeoman.io/) and its [`angular generator`](https://github.com/yeoman/generator-angular).

## Features

- Direct communication with the [`pwc-address-book-api`](https://github.com/somada141/pwc-address-book-api) RESTful API.
- Retrieval of all contacts currently under the database.
- Ability to upload a CSV file with contacts and add them to the database.
- Enforcement of the 'unique email' rule with the option to drop/accept overrides.

## Usage

![pabui](https://user-images.githubusercontent.com/272419/29993378-71c3fe96-8ff8-11e7-8af6-2f0339174d7b.gif)

## Installation

- Ensure that you've installed [`NodeJS`](https://nodejs.org/en/).
- Install [`bower`](https://bower.io/) through:

```
npm install --global bower
```

> The above step may require you to use `sudo`.

- Install the [`NodeJS`](https://nodejs.org/en/) modules required by the project with:

```
npm install
```

- Install the dependencies via [`bower`](https://bower.io/) as such:

```
bower install
```

- Serve a local copy of the application through [`GruntJS`](https://gruntjs.com/) as such:

```
grunt serve
```
