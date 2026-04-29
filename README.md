# 使用 OpenClaw + OpenCode + GitHub 从零开发自动化代码项目

> 本项目所有代码、文档、优化均为 AI 自动编写并上传，**作者仅通过自然语言描述需求，未手动敲过任何代码**

---

## ⚠️ 重要说明

本项目是 **AI 全自动开发** 的实践案例：

| 操作 | 方式 |
|------|------|
| 需求描述 | 作者仅使用自然语言（如"帮我开发一个贪吃蛇游戏"） |
| 代码编写 | OpenCode 自动生成（index.html、game.css、game.js） |
| 代码优化 | OpenCode 自动优化（粒子特效、视觉效果、UI升级） |
| GitHub 上传 | OpenCode 自动完成（add → commit → push） |
| 文档编写 | OpenCode 自动生成 README.md |

**作者全程未手动编写或复制粘贴任何代码**，所有内容均由 AI 自动完成。

---

## 🎯 项目简介
### 该项目内容均为opencode+openclaw自动编写并上传
本教程展示如何通过 **OpenClaw** 调度 **OpenCode** 编程智能体，用自然语言描述需求即可完成代码编写，并自动推送到 GitHub 仓库。**无需手动敲代码**，小白也能快速上手！

**技术栈：**
- OpenClaw — AI 调度中枢，自然语言任务分发
- OpenCode — 编程智能体，理解需求并生成代码
- GitHub — 代码托管与版本管理

---

## 📋 前置准备

| 工具 | 说明 |
|------|------|
| OpenClaw | 已安装并配置好的 AI 助手 |
| OpenCode | `npm install -g opencode` |
| GitHub 账号 | 用于创建仓库和生成 Token |
| GitHub Personal Access Token | 用于 CLI 认证推送代码 |

---

## 🚀 从零开发贪吃蛇游戏

以下是**真实开发过程**，完整记录每一步操作：

### 第一步：创建工作目录

```bash
mkdir -p myopencode
cd myopencode
```

### 第二步：启动 OpenCode 并初始化

```
帮我切换到myopencode这个目录，然后启动opencode
```

OpenCode 自动初始化环境：
- ✅ 创建 `memory/` 目录
- ✅ 创建 `MEMORY.md`（长期记忆）
- ✅ 创建 `memory/2026-04-24.md`（今日记录）

### 第三步：自然语言描述开发需求

```
在opencode中帮我开发一个贪吃蛇的游戏
```

### 第四步：OpenCode 自动生成代码

OpenCode 会自动读取需求，生成三个文件：

| 文件 | 职责 |
|------|------|
| `index.html` | 游戏主页面 + Canvas 画布 |
| `game.css` | 样式文件（霓虹风格） |
| `game.js` | 游戏逻辑 |

### 第五步：推送代码到 GitHub

**配置 Git 用户信息：**

```bash
git config user.email "1723634231@qq.com"
git config user.name "美羊羊mao-0910"
```

**初始化 Git 并提交：**

```bash
git init
git add index.html game.css game.js
git commit -m "feat: 贪吃蛇游戏 v1.0"
```

**使用 Token 推送：**

```bash
git remote add origin https://<TOKEN>@github.com/mao-0910/openclaw-opencode.git
git push -u origin main
```

---

## 📊 完整流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        开始                                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. 创建工作目录                                                │
│     mkdir -p myopencode && cd myopencode                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. 启动 OpenCode                                               │
│     opencode run "初始化环境"                                    │
│     └── 自动创建 memory/、MEMORY.md、memory/2026-04-24.md        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. 描述开发需求（作者仅使用自然语言）                             │
│     "在opencode中帮我开发一个贪吃蛇的游戏"                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. OpenCode 自动生成代码                                       │
│     ├── index.html  ← AI 自动编写                              │
│     ├── game.css    ← AI 自动编写                              │
│     └── game.js     ← AI 自动编写                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. AI 自动提交 Git                                            │
│     git add . && git commit -m "AI 自动提交"                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. AI 自动推送到 GitHub                                       │
│     git push ← AI 自动完成                                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  ✅ 完成！访问 https://github.com/mao-0910/openclaw-opencode   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎮 贪吃蛇游戏功能一览

### 核心玩法
- ⬆️⬇️⬅️➡️ 方向键 / 触摸滑动控制蛇的移动
- 🍎 吃到食物 +10 分，蛇身增长
- 💀 撞到墙壁或自己的身体 → 游戏结束
- ⏸️ 空格键暂停 / 继续
- 🏆 最高分自动保存到 LocalStorage

### 视觉效果（后续优化版本）
- ✨ 动态粒子背景（鼠标交互）
- 🌟 蛇身发光 + 渐变色（头亮尾暗）
- 💓 食物脉动闪烁动画
- 🔥 得分时数字跳动反馈
- 💥 游戏结束白色闪光
- 🔮 玻璃拟态（Glassmorphism）UI
- 🎬 入场动画与悬停动效
- 📱 响应式设计，完美适配移动端

---

## 🔐 GitHub Token 配置教程

### 生成 Token

1. 访问 https://github.com/settings/tokens
2. → **Developer settings** → **Personal access tokens** → **Generate new token (classic)**
3. 勾选 **`repo`** 权限
4. 设置过期时间（建议 90 天）
5. 点击 **Generate token** 并复制保存

### 使用 Token 推送

```bash
git remote set-url origin https://<TOKEN>@github.com/user/repo.git
git push
```

---

## 🔧 技术实现细节

### 粒子系统

```javascript
// 80个粒子随机分布，鼠标靠近时排斥
function updateParticles() {
    particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            p.x -= dx * 0.02;  // 排斥效果
            p.y -= dy * 0.02;
        } else {
            p.x += p.speedX;   // 自由飘动
            p.y += p.speedY;
        }
    });
}
```

### 蛇身渐变

```javascript
// 从头部亮绿到尾部暗绿
function getSnakeGradientColor(index, total) {
    const ratio = total > 1 ? index / (total - 1) : 0;
    const g = Math.floor(255 - ratio * 100);  // 绿色渐减
    const b = Math.floor(136 - ratio * 68);   // 蓝色渐减
    return `rgb(0, ${g}, ${b})`;
}
```

### 食物脉动

```javascript
// 正弦波动实现闪烁效果
foodPulse += 0.1;
const pulseSize = 4 + Math.sin(foodPulse) * 2;
ctx.shadowBlur = 15 + Math.sin(foodPulse) * 5;
```

---

## 📂 项目结构

```
openclaw-opencode/
├── index.html     # 游戏主页面
├── game.css       # 现代化样式
├── game.js        # 游戏逻辑 + 粒子特效
├── README.md      # 项目文档
└── .git/          # Git 仓库
```

---

## 💡 核心优势对比

| 传统方式 | OpenClaw + OpenCode |
|----------|---------------------|
| 手敲代码，容易出错 | 自然语言描述，AI 自动生成 |
| 需查阅文档 | 需求即文档 |
| 代码风格不统一 | AI 统一代码规范 |
| 手动管理 Git | AI 自动提交推送 |
| 反复调试 | 一句话重写优化 |

---

## 🎉 结语

通过 **OpenClaw** 调度 **OpenCode**，只需用自然语言描述需求：
- ✅ 一句话开发游戏原型
- ✅ 一句话优化视觉效果
- ✅ 一句话推送 GitHub

**全程无需手动敲代码！**

📖 **在线体验：** 打开 `index.html` 即可在浏览器中运行贪吃蛇游戏

📚 **项目地址：** https://github.com/mao-0910/openclaw-opencode
