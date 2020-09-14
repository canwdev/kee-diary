# KeeDiary

## Introduction

A diary editor application that uses KeePass technology to encrypt storage. With Syncthing, you can easily synchronize on different devices.

The following techniques are used:

- Electron
- Vue / Quasar UI
- [kdbxweb](https://github.com/keeweb/kdbxweb)

## Features

Under development...

- [ ] Create database
- [x] Open a database (`password`/`password+key`)
- [x] Save database/close database
- [ ] Full database search
- [x] Dark mode
- [ ] Welcome page
- [ ] About page
- [ ] i18n support
- Groups
    - [x] Create new entry
    - [x] Create new group
    - [x] Rename group
    - [x] Change icon
    - [x] Move group
    - [x] Move to the recycle bin
    - [x] Empty trash
- Entries
    - [x] List view (sort)
    - [ ] Calendar view
    - [x] Change icon
    - [x] Change color
    - [x] Markdown support
    - [x] Preview
    - [x] Rename entry
    - [x] Edit (CodeMirror)
    - [ ] Edit with external tools
    - [x] Import/Export
    - [x] Move entry
    - [x] Delete entry

## Development

```sh
# Install dependencies
yarn install
yarn install --cwd "./frontend"

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

## Remarks

- `kdbxweb` It is a function library for operating the kdbx database. Due to domestic network problems, [copy version](https://gitee.com/canwdev/kdbxweb) is used，there are no other changes.
- last KeeDiary version: [kee-diary-react-electron](https://github.com/canwdev/kee-diary-react-electron)



