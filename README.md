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
- [X] Open a single database (`password`/`password+key`)
- [X] Browse groups and entries in groups
- [X] Save database/close database
- [X] Determine whether the database has been changed
- [ ] Full database search
- [ ] Implement calendar view
- [X] Support dark mode
- Groups
    - [ ] Rename group
    - [ ] Move to the recycle bin
    - [ ] Empty trash
    - [ ] Move group
    - [ ] New group
    - [ ] List expansion and contraction
- Entries
    - [X] View and edit the title (Title) and content (Note)
    - [X] Create new entry
    - [X] Delete entry
    - [ ] Move entry
    - [X] Sort (sort by creation or modification date)
    - [X] Markdown support
    - [X] Modify icon

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



