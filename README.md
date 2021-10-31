# KeeNote

## 简介 · Introduction

kdbx 加密笔记应用程序

A note editor application that uses KeePass technology to encrypt storage.

## 技术栈 · Technology

- Electron
- Vue 2
- [kdbxweb](https://github.com/keeweb/kdbxweb)

## 开发 · Development

```sh
# 安装依赖
yarn ist

# 启动开发环境
yarn run dev
```

## 构建 · Build

```sh
# 安装全局依赖
npm -i -g electron-builder

# 首先构建前端
yarn run build:frontend

# 构建Electron
yarn run build:electron
```
