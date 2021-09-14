# KeeNote

## Introduction

A note editor application that uses KeePass technology to encrypt storage.

The following techniques are used:

- Electron
- Vue
- [kdbxweb](https://github.com/keeweb/kdbxweb)

## Development

```sh
# Install dependencies
yarn ist

# Run development
yarn run dev
```

## Build production

```sh
# Global install: electron-builder
npm -i -g electron-builder

# Build frontend first
yarn run build:frontend

# Build electron executable file
yarn run build:electron
```
