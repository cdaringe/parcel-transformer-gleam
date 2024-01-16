# parcel-transformer-gleam

Build gleam apps with parcel bundler.

[![TypeScript package](https://img.shields.io/badge/language-typescript-blue)](https://www.typescriptlang.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## install

`npm install --save parcel-transformer-gleam`

## usage

```json5
// .parcelrc
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.gleam": [
      "parcel-transformer-gleam"
    ]
  }
}

```
