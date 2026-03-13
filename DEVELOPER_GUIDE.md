# 技能开发者指南

## 🎯 开发概述

本指南将帮助你创建自己的 AI Agent 技能模块，为开源社区贡献高质量的技能。

## 📋 开发规范

### 技能结构
每个技能应遵循以下标准结构：

```
your-skill/
├── SKILL.md              # 技能说明文档（必需）
├── package.json          # 依赖配置（JS 技能必需）
├── requirements.txt      # Python 依赖（Python 技能必需）
├── index.js              # 入口文件（JS）
├── main.py              # 入口文件（Python）
├── tests/               # 测试目录
│   └── *.test.js
├── examples/            # 示例代码
│   └── example.js
├── docs/               # 详细文档
│   └── usage.md
└── README.md           # 技能专用说明
```

### 命名规范
- **目录名**: 小写字母，连字符分隔 (例: `my-awesome-skill`)
- **文件名**: 小写字母，连字符或下划线分隔
- **类名**: PascalCase (例: `MyAwesomeSkill`)
- **函数名**: camelCase (JavaScript) / snake_case (Python)

## 🛠️ 开发环境设置

### 必需工具
```bash
# Node.js 环境
npm install -g nodemon jest

# Python 环境
pip install pytest black flake8

# 开发工具
npm install -g eslint prettier
```

### 环境配置
创建 `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📝 SKILL.md 模板

```markdown
# Your Skill Name

技能的简短描述（中文）

## 技能信息

- **分类**: ai-agents/automation/development/integration/management/utilities
- **语言**: JavaScript/Python
- **作者**: Your Name
- **许可**: MIT
- **版本**: 1.0.0

## 功能描述

详细说明这个技能能做什么：

### 主要功能
- 功能1描述
- 功能2描述
- 功能3描述

### 使用场景
- 场景1：什么时候使用
- 场景2：解决问题的类型

## 安装和配置

### 依赖要求
- Node.js >= 16.0.0
- Python >= 3.8
- 其他系统依赖

### 配置步骤
1. 步骤一
2. 步骤二
3. 步骤三

### 环境变量
```bash
ENV_VAR_NAME=your_value
ANOTHER_VAR=another_value
```

## 使用方法

### 基本用法示例
```javascript
// JavaScript 示例
const skill = require('./index.js');
skill.execute({ param1: 'value1' });
```

```python
# Python 示例
from main import YourSkill
skill = YourSkill()
skill.run(param1='value1')
```

### 高级配置
详细的高级配置说明

## API 参考

### 函数/方法说明
```javascript
/**
 * 函数的简短描述
 * @param {type} paramName - 参数描述
 * @returns {type} 返回值描述
 */
function exampleFunction(paramName) {
  // 实现
}
```

## 测试

### 运行测试
```bash
# JavaScript
npm test

# Python
pytest
```

### 测试覆盖率
```bash
npm run test:coverage
```

## 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT License - see LICENSE file for details

## 更新日志

### v1.0.0 (2024-XX-XX)
- 初始版本
- 基本功能实现
```

## 💻 代码示例

### JavaScript 技能示例

```javascript
// index.js
class MyAwesomeSkill {
  constructor(config = {}) {
    this.config = {
      timeout: 5000,
      retries: 3,
      ...config
    };
  }

  /**
   * 执行主要功能
   * @param {Object} params - 输入参数
   * @returns {Promise<Object>} 执行结果
   */
  async execute(params) {
    try {
      const result = await this.processInput(params);
      return {
        success: true,
        data: result,
        message: '执行成功'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '执行失败'
      };
    }
  }

  async processInput(params) {
    // 核心逻辑实现
    return params;
  }
}

module.exports = MyAwesomeSkill;
```

### Python 技能示例

```python
# main.py
import logging
from typing import Dict, Any, Optional

class MyAwesomeSkill:
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = {
            'timeout': 5000,
            'retries': 3,
            **(config or {})
        }
        self.logger = logging.getLogger(__name__)

    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """执行主要功能
        
        Args:
            params: 输入参数字典
            
        Returns:
            执行结果字典
        """
        try:
            result = self.process_input(params)
            return {
                'success': True,
                'data': result,
                'message': '执行成功'
            }
        except Exception as error:
            self.logger.error(f"执行失败: {error}")
            return {
                'success': False,
                'error': str(error),
                'message': '执行失败'
            }

    def process_input(self, params: Dict[str, Any]) -> Any:
        """核心逻辑实现"""
        return params

if __name__ == "__main__":
    # 使用示例
    skill = MyAwesomeSkill()
    result = skill.execute({'test': 'value'})
    print(result)
```

## 🧪 测试指南

### 单元测试

JavaScript (Jest):
```javascript
// tests/index.test.js
const MyAwesomeSkill = require('../index.js');

describe('MyAwesomeSkill', () => {
  let skill;

  beforeEach(() => {
    skill = new MyAwesomeSkill();
  });

  test('应该成功执行基本功能', async () => {
    const params = { test: 'value' };
    const result = await skill.execute(params);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual(params);
  });

  test('应该处理错误情况', async () => {
    const result = await skill.execute(null);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

Python (pytest):
```python
# tests/test_main.py
import pytest
from main import MyAwesomeSkill

class TestMyAwesomeSkill:
    def setup_method(self):
        self.skill = MyAwesomeSkill()

    def test_execute_success(self):
        """测试成功执行"""
        params = {'test': 'value'}
        result = self.skill.execute(params)
        
        assert result['success'] is True
        assert result['data'] == params

    def test_execute_failure(self):
        """测试错误处理"""
        result = self.skill.execute(None)
        
        assert result['success'] is False
        assert 'error' in result
```

## 📦 打包和分发

### npm 包发布
```bash
# 构建包
npm run build

# 发布到 npm
npm publish
```

### Python 包发布
```bash
# 构建
python setup.py sdist bdist_wheel

# 发布到 PyPI
twine upload dist/*
```

## 🔍 代码质量

### ESLint 配置 (.eslintrc.js)
```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error'
  }
};
```

### Python 代码质量

requirements-dev.txt:
```
black>=21.0.0
flake8>=3.8.0
pytest>=6.0.0
pytest-cov>=2.0.0
mypy>=0.800
```

## 🚀 部署和集成

### OpenClaw 集成
```json
{
  "name": "my-awesome-skill",
  "version": "1.0.0",
  "main": "index.js",
  "openclaw": {
    "category": "utilities",
    "description": "我的超棒技能",
    "author": "Your Name",
    "license": "MIT"
  }
}
```

### 环境变量管理
```bash
# .env.example
API_KEY=your_api_key_here
DATABASE_URL=your_database_url
LOG_LEVEL=info

# .env (不要提交到版本控制)
API_KEY=actual_api_key
DATABASE_URL=actual_database_url
LOG_LEVEL=debug
```

## 📈 性能优化

### 性能监控
```javascript
// performance.js
const performance = require('perf_hooks');

class PerformanceMonitor {
  static async measure(fn, label = 'Operation') {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  }
}
```

### 缓存策略
```python
# cache.py
from functools import lru_cache
import time

class TimedCache:
    def __init__(self, ttl=300):
        self.ttl = ttl
        self.cache = {}
    
    def get(self, key):
        if key in self.cache:
            value, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return value
        return None
    
    def set(self, key, value):
        self.cache[key] = (value, time.time())
```

## 🤝 社区贡献

### Pull Request 流程
1. Fork 仓库并创建分支
2. 编写代码和测试
3. 确保所有测试通过
4. 更新文档
5. 提交 PR

### 代码审查清单
- [ ] 代码符合项目规范
- [ ] 包含适当的测试
- [ ] 文档已更新
- [ ] 性能影响可接受
- [ ] 安全性已考虑

---

开始开发你的第一个技能吧！如有问题，欢迎在社区讨论。