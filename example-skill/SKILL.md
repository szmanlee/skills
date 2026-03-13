# 文件助手技能

一个强大且灵活的文件处理技能，提供文件操作、内容分析和批量处理功能。

## 技能信息

- **分类**: utilities
- **语言**: JavaScript
- **作者**: szmanlee
- **许可**: MIT
- **版本**: 1.0.0

## 功能描述

文件助手技能为 AI Agent 提供完整的文件处理能力：

### 主要功能
- 文件读写操作（支持多种格式）
- 文件内容分析和提取
- 批量文件处理
- 文件搜索和过滤
- 文件监控和变更检测

### 使用场景
- 文档自动化处理
- 日志文件分析
- 配置文件管理
- 数据文件转换
- 文件系统监控

## 安装和配置

### 依赖要求
- Node.js >= 16.0.0
- 文件系统访问权限

### 环境变量
```bash
# 可选配置
FILE_HELPER_MAX_FILE_SIZE=10485760  # 10MB
FILE_HELPER_WATCH_INTERVAL=1000     # 1秒
FILE_HELPER_LOG_LEVEL=info
```

## 使用方法

### 基本用法示例
```javascript
const FileHelper = require('./index.js');

// 创建实例
const fileHelper = new FileHelper({
  maxFileSize: '10MB',
  watchInterval: 1000
});

// 读取文件
const content = await fileHelper.readFile('./data.txt');

// 写入文件
await fileHelper.writeFile('./output.txt', 'Hello World!');

// 搜索文件
const results = await fileHelper.search('./logs/', '*.log');

// 监控文件
fileHelper.watchFile('./config.json', (event) => {
  console.log('文件变更:', event);
});
```

### 高级配置
```javascript
const config = {
  encoding: 'utf8',
  backupEnabled: true,
  backupCount: 5,
  searchRecursive: true,
  ignorePatterns: ['node_modules', '.git']
};

const fileHelper = new FileHelper(config);
```

## API 参考

### 主要方法

#### readFile(filePath, options)
读取文件内容
- `filePath`: 文件路径
- `options`: 读取选项
- `Returns`: Promise<string> 文件内容

#### writeFile(filePath, content, options)
写入文件内容
- `filePath`: 文件路径  
- `content`: 文件内容
- `options`: 写入选项
- `Returns`: Promise<boolean> 是否成功

#### search(directory, pattern, options)
搜索匹配的文件
- `directory`: 搜索目录
- `pattern`: 文件模式
- `options`: 搜索选项
- `Returns`: Promise<Array> 匹配文件列表

#### watchFile(filePath, callback)
监控文件变更
- `filePath`: 文件路径
- `callback`: 变更回调函数
- `Returns`: Function 停止监控的函数

## 测试

### 运行测试
```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "readFile"

# 生成测试覆盖率报告
npm run test:coverage
```

### 测试示例
```javascript
describe('FileHelper', () => {
  test('应该成功读取文件', async () => {
    const content = await fileHelper.readFile('./test.txt');
    expect(content).toBeDefined();
  });
});
```

## 错误处理

技能包含完善的错误处理机制：

```javascript
try {
  const content = await fileHelper.readFile('./nonexistent.txt');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('文件不存在');
  } else {
    console.log('其他错误:', error.message);
  }
}
```

## 性能优化

- 大文件分块读取
- 异步操作避免阻塞
- 内置缓存机制
- 批量操作优化

## 安全注意事项

- 文件路径验证
- 权限检查
- 大小限制
- 备份机制

## 许可证

MIT License - see LICENSE file for details

## 更新日志

### v1.0.0 (2024-03-12)
- 初始版本发布
- 基础文件操作功能
- 文件搜索和监控
- 完整的错误处理
- 测试覆盖率 95%+