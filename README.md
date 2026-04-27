# openclaw + opencode + github 快速上手指南

> 本文记录如何使用 OpenClaw + OpenCode + GitHub 从零开发并部署一个贪吃蛇游戏。

## 整体流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        开始                                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. 创建工作目录                                                │
│     mkdir -p myopencode                                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. 配置 Git 用户信息                                           │
│     git config user.email "邮箱"                                 │
│     git config user.name "用户名"                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. 初始化 OpenCode 环境                                       │
│     opencode run "初始化环境"                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. 开发贪吃蛇游戏                                              │
│     opencode run "开发一个贪吃蛇游戏"                             │
│     ├── index.html  ← 游戏主页面                                │
│     ├── game.css    ← 样式文件                                  │
│     └── game.js     ← 游戏逻辑                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. 初始化 Git 仓库并提交代码                                    │
│     git init                                                    │
│     git add .                                                  │
│     git commit -m "feat: 贪吃蛇游戏 v1.0"                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. 创建 GitHub 仓库                                            │
│     https://github.com/new                                      │
│     仓库名: openclaw-opencode                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. 生成 GitHub Personal Access Token                           │
│     Settings → Developer settings → Personal access tokens      │
│     勾选 repo 权限                                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  8. 配置远程仓库认证                                             │
│     git remote add origin https://TOKEN@github.com/user/repo   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  9. 推送代码到 GitHub                                           │
│     git branch -M main                                          │
│     git push -u origin main                                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  10. 完成！访问 https://github.com/mao-0910/openclaw-opencode  │
└─────────────────────────────────────────────────────────────────┘
```

## 详细步骤

### 步骤1：创建工作目录

```bash
mkdir -p myopencode
cd myopencode
```

### 步骤2：配置 Git 用户信息

```bash
git config user.email "1723634241@qq.com"
git config user.name "美羊羊mao-0910"
```

> 每个人的 GitHub 账号信息不同，请替换为你的邮箱和用户名

### 步骤3：初始化 OpenCode 环境

```bash
opencode run "初始化环境"
```

OpenCode 会自动创建：
- `memory/` 目录 - 用于存放记忆文件
- `MEMORY.md` - 长期记忆文件
- `memory/2026-04-24.md` - 今日记录

### 步骤4：开发贪吃蛇游戏

```bash
opencode run "开发一个贪吃蛇游戏，使用HTML/CSS/JavaScript实现"
```

OpenCode 自动生成三个文件：

| 文件 | 说明 |
|------|------|
| index.html | 游戏主页面，包含 Canvas 画布 |
| game.css | 霓虹风格样式，绿色主题 |
| game.js | 游戏核心逻辑：蛇移动、吃食物、碰撞检测 |

### 步骤5：初始化 Git 仓库并提交

```bash
git init                          # 初始化 Git 仓库
git add index.html game.css game.js  # 添加文件到暂存区
git commit -m "feat: 贪吃蛇游戏 v1.0"  # 提交代码
```

### 步骤6：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库名称：`openclaw-opencode`
3. 选择 Public（公开）或 Private（私有）
4. 点击 Create repository

### 步骤7：生成 GitHub Token

1. 打开 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 **`repo`** 权限
4. 设置过期时间（建议 30 天以上）
5. 点击 Generate
6. **复制 Token**（只会显示一次）

### 步骤8：配置远程仓库认证

```bash
git remote add origin https://github.com/mao-0910/openclaw-opencode.git
git remote set-url origin https://你的TOKEN@github.com/mao-0910/openclaw-opencode.git
```

### 步骤9：推送代码

```bash
git branch -M main                # 将分支名改为 main
git push -u origin main           # 推送到远程仓库
```

### 步骤10：验证

访问 https://github.com/mao-0910/openclaw-opencode 查看推送结果

## 常见问题

**Q: 为什么需要 GitHub Token？**
A: GitHub 不再支持密码推送，必须使用 Personal Access Token 进行认证。

**Q: Token 泄露了怎么办？**
A: 立即到 GitHub 设置页面删除该 Token，重新生成一个新的。

**Q: 推送失败怎么办？**
A: 检查 Token 是否有 repo 权限，确认仓库是否已创建。

## 游戏效果预览

贪吃蛇游戏功能：
- 方向键 ↑↓←→ 控制蛇的移动方向
- 空格键 暂停/继续游戏
- 吃到食物 +10 分
- 撞到墙壁或自己的身体游戏结束
- 最高分保存在本地 LocalStorage

## 总结

使用 OpenClaw + OpenCode + GitHub，可以实现：
1. ✅ 快速开发游戏原型
2. ✅ 代码版本管理
3. ✅ 云端备份和分享

整个流程只需 10 分钟，适合快速原型开发！
