# KeeDiary

日记编辑器，使用 kdbx 作为数据库加密存储你的日记。

> 配合 Syncthing 使用，可以方便的在不同设备同步数据库。

## Screenshots · 截图



## TechStack · 技术栈

- Electron
- Vue
- [kdbxweb](https://github.com/keeweb/kdbxweb) (用于操作数据库，由于网络问题使用了拷贝的国内源)

## Features · 特性

- [ ] 打开数据库（`密码`/`密码+密钥`）
- [ ] 浏览群组(groups)和群组里面的条目(entries)
- [ ] 保存数据库/关闭数据库
- [ ] 使用一个变量判断数据库是否被改动
- [ ] 加密存储本地密码
- [ ] 全数据库搜索功能
- [ ] 实现日历视图
- [ ] 支持黑暗模式
- 群组(groups)
    - [ ] 重命名群组
    - [ ] 移动至回收站（如果关闭了回收站则直接删除群组）
    - [ ] 清空回收站
    - [ ] 移动群组
    - [ ] 新建群组
    - [ ] 列表的展开与收缩
    - [ ] 渲染性能优化
- 条目(entries)
    - [ ] 标题(Title)和内容(Note)的查看与编辑
    - [ ] 创建新条目
    - [ ] 删除条目
    - [ ] 移动条目
    - [ ] 列表性能优化
    - [ ] 排序（按创建或修改日期排序）
    - [ ] 搜索/过滤
    - [ ] Markdown 支持
    - [ ] 修改图标

## Run · 运行

```sh
# 安装依赖
yarn install

# 开发模式 
yarn run dev
```

## Build · 构建

```sh
# 全局安装 electron-builder
npm -i -g electron-builder

# 首先构建前端
yarn run build:frontend

# 构建 electron 生成可执行文件
yarn run build:electron
```

## 备注

- 如果在开发过程中出现 electron 无法启动的问题，请删除应用缓存：`C:\Users\<user>\AppData\Roaming\<yourAppName>` （已查明是 `electron-devtools-installer` 插件的问题，已禁用插件）

## Reference · 参考

- [kee-diary-react-electron](https://github.com/canwdev/kee-diary-react-electron)
