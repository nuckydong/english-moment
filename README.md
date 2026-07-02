# 🎮 英语拼词小游戏 - 初级版

专为小学生设计的趣味英语单词学习游戏，通过游戏化的方式让孩子们轻松学习英语单词。

## ✨ 功能特点

### 🎯 游戏模式
- **⏰ 计时挑战模式**：120秒内答对尽可能多的单词，挑战高分
- **🎯 闯关模式**：10个精心设计的关卡，逐级解锁，每关5个单词
- **🧩 单词连连看**：配对英语和中文，配对成功就消失
- **📚 单词表**：查看所有单词，点击扬声器朗读

### 📚 学习内容
- 120个适合初学的英语单词
- 3个难度等级：简单（≤3字母）、普通（4-5字母）、困难（6字母+）
- 图文结合：每个单词配有emoji表情和中文释义
- 每个单词配有音标和例句

### 🏆 成就系统
- 8种不同成就徽章
- 记录学习进度和里程碑
- 激励持续学习

### 💾 进度保存
- 自动保存游戏进度
- 记录最高分和关卡完成情况
- 成就解锁永久保存

### 📱 移动端优化
- 响应式设计，完美适配手机、平板、电脑
- 大按钮设计，方便小朋友操作
- 清晰易读的字体和色彩

### ♿ 无障碍支持
- 所有模态框支持 ARIA 属性和键盘导航
- 计时器带 live region 朗读
- 难度选择器使用 radiogroup 语义
- 所有交互元素有 aria-label

## 🚀 快速开始

### 安装依赖

```bash
npm install --legacy-peer-deps
```

### 开发模式

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看游戏。

### 生产构建

```bash
npm run build
npm start
```

### Docker 部署

```bash
# 构建镜像（使用 standalone 模式，镜像更小）
docker build -t english-moment .

# 运行容器（通过 -e 传入百度 API 密钥）
docker run -p 3000:3000 -e BAIDU_API_KEY="your_key" -e BAIDU_SECRET_KEY="your_secret" english-moment
```

## 🎮 游戏玩法

### 计时挑战模式
1. 选择难度等级（简单/普通/困难）
2. 点击"计时挑战"按钮开始游戏
3. 看图识意，拼出正确的英文单词
4. 120秒内答对越多，得分越高
5. 连续答对可获得连击加分

### 闯关模式
1. 选择难度等级
2. 点击"闯关模式"按钮
3. 从第1关开始，每关需答对5个单词
4. 完成一关后解锁下一关
5. 根据用时获得1-3星评价：
   - ⭐⭐⭐ 30秒内完成
   - ⭐⭐ 60秒内完成
   - ⭐ 超过60秒完成

### 成就系统
- **初次尝试** 🎯：完成第一个单词
- **连胜高手** 🔥：连续答对5个单词
- **无敌战神** ⚡：连续答对10个单词
- **百分宝宝** 💯：单局得分达到100分
- **闯关新星** ⭐：完成前5关
- **闯关大师** 👑：完成全部10关
- **完美通关** ✨：在一关中获得3星评价
- **速度之王** 🚀：60秒内答对15个单词

## 🛠️ 技术栈

- **框架**：Next.js 16 (App Router, Standalone 输出)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **状态管理**：Zustand (with persist middleware, skipHydration)
- **UI组件**：React 19
- **语音合成**：百度 TTS API + 浏览器 SpeechSynthesis 回退

## 📁 项目结构

```
.
├── app/
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 主页面（懒加载游戏模式）
│   ├── StoreHydration.tsx   # Zustand 水合组件
│   ├── error.tsx            # 全局错误边界
│   ├── loading.tsx          # 全局加载状态
│   └── api/
│       └── tts/
│            └── route.ts    # 百度 TTS API 路由（带输入校验和速率限制）
├── components/
│   ├── Achievements.tsx     # 成就系统组件
│   ├── LetterGameWithCallback.tsx  # 核心拼字游戏组件
│   ├── LevelMode.tsx        # 闯关模式组件
│   ├── MainMenu.tsx         # 主菜单组件
│   ├── MatchMode.tsx        # 连连看模式组件
│   ├── Modal.tsx            # 可复用模态框组件
│   ├── TimedMode.tsx        # 计时挑战组件
│   └── WordList.tsx         # 单词表组件
├── lib/
│   ├── words.ts             # 单词数据库（120词，按长度自动分类难度）
│   └── speech.ts            # 语音合成工具（百度TTS + 浏览器回退）
├── store/
│   └── gameStore.ts         # 游戏状态管理（Zustand + persist）
├── types/
│   └── index.ts             # 共享类型定义
└── public/
    └── tts-cache/            # TTS 音频缓存
```

## 🔧 配置

### 百度 TTS API

在 `.env.local` 中配置：

```
BAIDU_API_KEY="your_api_key"
BAIDU_SECRET_KEY="your_secret_key"
```

可前往[百度智能云](https://cloud.baidu.com/product/speech/tts)申请，免费额度充足。

如未配置或 API 不可用，会自动回退到浏览器内置的 SpeechSynthesis API。

### 修改单词库

编辑 `lib/words.ts` 文件添加或修改单词。难度按单词长度自动分类：
- ≤3 字母：easy
- 4-5 字母：medium
- 6+ 字母：hard

### 调整游戏参数

- **计时模式时长**：在 `components/TimedMode.tsx` 中修改 `GAME_DURATION`
- **每关单词数**：在 `components/LevelMode.tsx` 中修改 `WORDS_PER_LEVEL`
- **关卡总数**：在 `store/gameStore.ts` 中修改 `createInitialLevelsForDifficulty`
- **评分标准**：在各组件中修改星级时间阈值

## 🌟 未来计划

- [ ] 添加音效和背景音乐
- [ ] 真实图片替换emoji表情
- [ ] 多人对战模式
- [ ] 家长监控面板
- [ ] 更多主题和皮肤
- [ ] 拼写提示功能
- [ ] 单词复习模式
- [ ] 扩展更多词汇，小学/初中/高中/4、6级/雅思/托福
- [ ] 增加短语，句子，小中篇幅的英文故事等

## 📄 开源协议

MIT License

## 👨‍💻 作者
nuckydong@gmail.com

## 🙏 致谢

感谢所有为孩子们学习英语而努力的教育工作者和家长们！

---

**让学习变得更有趣！🎉**
