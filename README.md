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
- [ ] Save database/close database
- [ ] Determine whether the database has been changed
- [ ] Full database search function
- [ ] Implement calendar view
- [X] Support dark mode
- Groups
    - [ ] Rename group
    - [ ] Move to the recycle bin (if you close the recycle bin, delete the group directly)
    - [ ] Empty trash
    - [ ] Move group
    - [ ] New group
    - [ ] List expansion and contraction
- Entries
    - [ ] View and edit the title (Title) and content (Note)
    - [ ] Create new entry
    - [ ] Delete entry
    - [ ] Move entry
    - [ ] Sort (sort by creation or modification date)
    - [ ] Search/Filter
    - [ ] Markdown support
    - [ ] Modify icon

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



