# KeeDiary

## 简介

一款日记编辑器应用，使用 KeePass 技术加密存储。配合 Syncthing 使用，可以方便的在不同设备同步。

使用了以下技术：

- Electron
- Vue / Quasar UI
- [kdbxweb](https://github.com/keeweb/kdbxweb)

## 截图

开发中，暂时没有

## 功能特性

- [ ] 创建数据库
- [X] 打开单个数据库（`密码`/`密码+密钥`）
- [X] 浏览群组(groups)和群组里面的条目(entries)
- [ ] 保存数据库/关闭数据库
- [ ] 判断数据库是否被改动
- [ ] 全数据库搜索功能
- [ ] 实现日历视图
- [X] 支持黑暗模式
- 群组(groups)
    - [ ] 重命名群组
    - [ ] 移动至回收站（如果关闭了回收站则直接删除群组）
    - [ ] 清空回收站
    - [ ] 移动群组
    - [ ] 新建群组
    - [ ] 列表的展开与收缩
- 条目(entries)
    - [ ] 标题(Title)和内容(Note)的查看与编辑
    - [ ] 创建新条目
    - [ ] 删除条目
    - [ ] 移动条目
    - [ ] 排序（按创建或修改日期排序）
    - [ ] 搜索/过滤
    - [ ] Markdown 支持
    - [ ] 修改图标

## 开发运行

```sh
# 安装依赖
yarn install
yarn install --cwd "./frontend"

# 开发模式 
yarn run dev
```

## 生产构建

```sh
# 全局安装 electron-builder
npm -i -g electron-builder

# 首先构建前端
yarn run build:frontend

# 构建 electron 生成可执行文件
yarn run build:electron
```

## 备注

- `kdbxweb` 是一个用于操作 kdbx 数据库的函数库，由于国内网络问题使用了[拷贝的版本](https://gitee.com/canwdev/kdbxweb)，并无其他改动。
- 上一个版本：[kee-diary-react-electron](https://github.com/canwdev/kee-diary-react-electron)



