# 安装和使用指南

## 📦 安装步骤

### 方式一：直接克隆仓库
```bash
git clone https://github.com/szmanlee/skills.git
cd skills
```

### 方式二：通过 OpenClaw 安装
```bash
# 如果你有 OpenClaw 环境
npx skills find szmanlee/skills
npx skills install szmanlee/skills
```

### 方式三：下载压缩包
1. 访问 https://github.com/szmanlee/skills
2. 点击 "Code" -> "Download ZIP"
3. 解压到本地目录

## 🔧 环境要求

- **Node.js**: >= 16.0.0
- **Python**: >= 3.8 (某些技能需要)
- **OpenClaw**: >= 1.0.0 (推荐)

## 📁 目录结构说明

```
skills/
├── README.md                 # 项目说明
├── README_CN.md             # 中文说明
├── LICENSE                  # MIT 许可证
├── agents/                  # 智能体配置
│   ├── example-agent.json   # 智能体配置示例
│   └── ...
└── skills/                  # 技能模块
    ├── ai-agents/          # AI 智能体类技能
    │   ├── agent-council/  # 多智能体协调
    │   ├── coding-agent/   # 代码开发智能体
    │   └── ...
    ├── automation/         # 自动化技能
    ├── development/        # 开发相关技能
    ├── integration/        # 集成类技能
    ├── management/         # 管理类技能
    └── utilities/          # 实用工具
```

## 🚀 快速开始

### 1. 选择技能
浏览 `skills/` 目录，选择你需要的技能模块。

### 2. 配置技能
每个技能都有自己的配置文件，通常在技能目录的根目录：

```bash
cd skills/coding-agent
ls -la
# 通常包含：
# - SKILL.md (技能说明)
# - package.json (依赖)
# - index.js 或 main.py (主文件)
```

### 3. 安装依赖
```bash
# JavaScript 技能
npm install

# Python 技能
pip install -r requirements.txt
```

### 4. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置
nano .env
```

### 5. 测试技能
```bash
# 运行测试
npm test
# 或
python -m pytest
```

## 📚 使用示例

### 代码开发智能体
```bash
cd skills/ai-agents/coding-agent
npm start -- --project /path/to/your/project
```

### 多智能体协调
```bash
cd skills/ai-agents/agent-council
python main.py --config council-config.json
```

## 🛠️ 自定义技能

### 创建新技能
1. 在适当的分类目录下创建新文件夹
2. 创建 `SKILL.md` 说明文档
3. 编写主要实现代码
4. 添加测试和示例

### 技能模板
```bash
# 使用技能生成器
npm create skill@latest my-new-skill
```

## 🔄 更新技能

```bash
# 更新仓库
git pull origin main

# 更新依赖
npm update
pip install -r requirements.txt --upgrade
```

## 🐛 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   # 清除缓存重试
   npm cache clean --force
   npm install
   ```

2. **权限问题**
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   ```

3. **Python 版本不兼容**
   ```bash
   # 使用 pyenv 管理版本
   pyenv install 3.9.10
   pyenv local 3.9.10
   ```

### 获取帮助
- 查看 [GitHub Issues](https://github.com/szmanlee/skills/issues)
- 阅读 [OpenClaw 文档](https://docs.openclaw.ai)
- 加入社区讨论

## 📊 性能优化

### 技能配置优化
- 根据需求调整并发数
- 配置缓存策略
- 优化数据库连接

### 系统资源管理
- 监控内存使用
- 配置日志轮转
- 设置资源限制

## 🔒 安全注意事项

1. **敏感信息**: 使用环境变量存储 API 密钥
2. **权限控制**: 最小权限原则
3. **代码审查**: 使用前检查代码安全性
4. **更新维护**: 定期更新依赖和安全补丁

---

如有其他问题，欢迎提交 Issue 或参与讨论！