const FileHelper = require('../index.js');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

describe('FileHelper', () => {
  let fileHelper;
  let testDir;

  beforeEach(async () => {
    fileHelper = new FileHelper({
      maxFileSize: 1024 * 1024, // 1MB for testing
      backupEnabled: true,
      backupCount: 2
    });

    // 创建临时测试目录
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'filehelper-test-'));
  });

  afterEach(async () => {
    // 清理测试目录
    try {
      await fs.rmdir(testDir, { recursive: true });
    } catch (error) {
      console.warn('清理测试目录失败:', error.message);
    }
  });

  describe('readFile', () => {
    test('应该成功读取文件', async () => {
      const testFile = path.join(testDir, 'test.txt');
      const testContent = 'Hello, World!';
      
      await fs.writeFile(testFile, testContent);
      const content = await fileHelper.readFile(testFile);
      
      expect(content).toBe(testContent);
    });

    test('应该处理不存在的文件', async () => {
      const nonExistentFile = path.join(testDir, 'nonexistent.txt');
      
      await expect(fileHelper.readFile(nonExistentFile))
        .rejects.toThrow('读取文件失败');
    });

    test('应该检查文件大小限制', async () => {
      const testFile = path.join(testDir, 'large.txt');
      const largeContent = 'x'.repeat(2 * 1024 * 1024); // 2MB
      
      await fs.writeFile(testFile, largeContent);
      
      await expect(fileHelper.readFile(testFile))
        .rejects.toThrow('文件过大');
    });
  });

  describe('writeFile', () => {
    test('应该成功写入文件', async () => {
      const testFile = path.join(testDir, 'output.txt');
      const testContent = 'Test content';
      
      const result = await fileHelper.writeFile(testFile, testContent);
      
      expect(result).toBe(true);
      
      const writtenContent = await fs.readFile(testFile, 'utf8');
      expect(writtenContent).toBe(testContent);
    });

    test('应该自动创建目录', async () => {
      const deepDir = path.join(testDir, 'deep', 'nested', 'dir');
      const testFile = path.join(deepDir, 'output.txt');
      const testContent = 'Deep content';
      
      const result = await fileHelper.writeFile(testFile, testContent);
      
      expect(result).toBe(true);
      
      const exists = await fs.access(deepDir).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });

    test('应该创建备份文件', async () => {
      const testFile = path.join(testDir, 'backup.txt');
      const originalContent = 'Original content';
      const newContent = 'New content';
      
      // 先写入原文件
      await fs.writeFile(testFile, originalContent);
      
      // 再写入新内容（应该创建备份）
      await fileHelper.writeFile(testFile, newContent);
      
      // 检查备份文件是否存在
      const dir = await fs.readdir(testDir);
      const backupFiles = dir.filter(name => name.includes('backup'));
      
      expect(backupFiles.length).toBeGreaterThan(0);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      // 创建测试文件
      await fs.writeFile(path.join(testDir, 'test1.txt'), 'content1');
      await fs.writeFile(path.join(testDir, 'test2.log'), 'content2');
      await fs.writeFile(path.join(testDir, 'other.txt'), 'content3');
      
      // 创建子目录
      const subDir = path.join(testDir, 'subdir');
      await fs.mkdir(subDir);
      await fs.writeFile(path.join(subDir, 'subtest.txt'), 'subcontent');
    });

    test('应该搜索匹配的文件', async () => {
      const results = await fileHelper.search(testDir, '.txt');
      
      expect(results).toHaveLength(3); // test1.txt, other.txt, subtest.txt
      
      const names = results.map(r => r.name);
      expect(names).toContain('test1.txt');
      expect(names).toContain('other.txt');
      expect(names).toContain('subtest.txt');
    });

    test('应该使用正则表达式搜索', async () => {
      const pattern = /^test.*\.txt$/;
      const results = await fileHelper.search(testDir, pattern);
      
      expect(results).toHaveLength(2); // test1.txt, subtest.txt
    });

    test('应该返回文件信息', async () => {
      const results = await fileHelper.search(testDir, '.txt');
      
      expect(results[0]).toHaveProperty('path');
      expect(results[0]).toHaveProperty('name');
      expect(results[0]).toHaveProperty('size');
      expect(results[0]).toHaveProperty('modified');
    });
  });

  describe('getFileInfo', () => {
    test('应该返回文件信息', async () => {
      const testFile = path.join(testDir, 'info.txt');
      const testContent = 'File info test';
      await fs.writeFile(testFile, testContent);
      
      const info = await fileHelper.getFileInfo(testFile);
      
      expect(info.name).toBe('info.txt');
      expect(info.isFile).toBe(true);
      expect(info.size).toBe(testContent.length);
      expect(info.readable).toBe(true);
    });

    test('应该处理目录', async () => {
      const info = await fileHelper.getFileInfo(testDir);
      
      expect(info.isDirectory).toBe(true);
      expect(info.isFile).toBe(false);
    });
  });

  describe('processFiles', () => {
    test('应该批量处理文件', async () => {
      // 创建测试文件
      const files = [];
      for (let i = 0; i < 5; i++) {
        const file = path.join(testDir, `file${i}.txt`);
        await fs.writeFile(file, `content${i}`);
        files.push(file);
      }

      // 定义处理函数：计算文件长度
      const processor = async (filePath) => {
        const content = await fs.readFile(filePath, 'utf8');
        return { path: filePath, length: content.length };
      };

      const results = await fileHelper.processFiles(files, processor);
      
      expect(results).toHaveLength(5);
      
      // 检查所有处理都成功
      results.forEach(result => {
        expect(result.success).toBe(true);
        expect(result.result).toHaveProperty('length');
      });
    });

    test('应该处理并发限制', async () => {
      // 创建更多文件来测试并发
      const files = [];
      for (let i = 0; i < 10; i++) {
        const file = path.join(testDir, `concurrent${i}.txt`);
        await fs.writeFile(file, `content${i}`);
        files.push(file);
      }

      let concurrentCount = 0;
      const maxConcurrent = 3;

      const slowProcessor = async (filePath) => {
        concurrentCount++;
        expect(concurrentCount).toBeLessThanOrEqual(maxConcurrent);
        
        // 模拟慢操作
        await new Promise(resolve => setTimeout(resolve, 10));
        
        concurrentCount--;
        return { path: filePath };
      };

      const results = await fileHelper.processFiles(files, slowProcessor, {
        concurrency: maxConcurrent
      });
      
      expect(results).toHaveLength(10);
    });
  });

  describe('watchFile', () => {
    test('应该监控文件变更', (done) => {
      const testFile = path.join(testDir, 'watch.txt');
      
      // 创建初始文件
      fs.writeFile(testFile, 'initial content').then(() => {
        let callbackCount = 0;
        
        const stopWatching = fileHelper.watchFile(testFile, (event) => {
          callbackCount++;
          expect(event.event).toBe('change');
          expect(event.path).toBe(testFile);
          
          if (callbackCount === 1) {
            stopWatching();
            done();
          }
        });
        
        // 触发文件变更
        setTimeout(() => {
          fs.writeFile(testFile, 'updated content');
        }, 100);
      });
    }, 5000); // 增加超时时间
  });
});