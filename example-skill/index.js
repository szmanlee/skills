const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');

class FileHelper {
  constructor(config = {}) {
    this.config = {
      maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB
      watchInterval: config.watchInterval || 1000, // 1秒
      encoding: config.encoding || 'utf8',
      backupEnabled: config.backupEnabled || true,
      backupCount: config.backupCount || 5,
      searchRecursive: config.searchRecursive || true,
      ignorePatterns: config.ignorePatterns || ['node_modules', '.git', '.DS_Store'],
      ...config
    };
  }

  /**
   * 读取文件内容
   * @param {string} filePath - 文件路径
   * @param {Object} options - 读取选项
   * @returns {Promise<string>} 文件内容
   */
  async readFile(filePath, options = {}) {
    try {
      const absolutePath = path.resolve(filePath);
      const stats = await fs.stat(absolutePath);
      
      // 检查文件大小
      if (stats.size > this.config.maxFileSize) {
        throw new Error(`文件过大: ${stats.size} bytes (限制: ${this.config.maxFileSize} bytes)`);
      }

      const content = await fs.readFile(absolutePath, options.encoding || this.config.encoding);
      return content;
    } catch (error) {
      throw new Error(`读取文件失败 ${filePath}: ${error.message}`);
    }
  }

  /**
   * 写入文件内容
   * @param {string} filePath - 文件路径
   * @param {string|Buffer} content - 文件内容
   * @param {Object} options - 写入选项
   * @returns {Promise<boolean>} 是否成功
   */
  async writeFile(filePath, content, options = {}) {
    try {
      const absolutePath = path.resolve(filePath);
      
      // 确保目录存在
      await this.ensureDirectory(path.dirname(absolutePath));
      
      // 创建备份
      if (this.config.backupEnabled) {
        await this.createBackup(absolutePath);
      }

      await fs.writeFile(absolutePath, content, {
        encoding: options.encoding || this.config.encoding
      });

      return true;
    } catch (error) {
      throw new Error(`写入文件失败 ${filePath}: ${error.message}`);
    }
  }

  /**
   * 搜索匹配的文件
   * @param {string} directory - 搜索目录
   * @param {string|RegExp} pattern - 文件模式
   * @param {Object} options - 搜索选项
   * @returns {Promise<Array>} 匹配文件列表
   */
  async search(directory, pattern, options = {}) {
    const results = [];
    const absoluteDir = path.resolve(directory);
    const isRegExp = pattern instanceof RegExp;
    
    await this._searchRecursive(absoluteDir, pattern, isRegExp, results, options);
    
    return results;
  }

  /**
   * 递归搜索文件
   * @private
   */
  async _searchRecursive(dir, pattern, isRegExp, results, options) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // 跳过忽略的模式
        if (this.shouldIgnore(fullPath)) {
          continue;
        }
        
        if (entry.isDirectory() && this.config.searchRecursive) {
          await this._searchRecursive(fullPath, pattern, isRegExp, results, options);
        } else if (entry.isFile()) {
          if (isRegExp ? pattern.test(entry.name) : entry.name.includes(pattern)) {
            const stats = await fs.stat(fullPath);
            results.push({
              path: fullPath,
              name: entry.name,
              size: stats.size,
              modified: stats.mtime
            });
          }
        }
      }
    } catch (error) {
      console.warn(`搜索目录失败 ${dir}: ${error.message}`);
    }
  }

  /**
   * 监控文件变更
   * @param {string} filePath - 文件路径
   * @param {Function} callback - 变更回调
   * @returns {Function} 停止监控的函数
   */
  watchFile(filePath, callback) {
    const absolutePath = path.resolve(filePath);
    
    const watcher = chokidar.watch(absolutePath, {
      persistent: true,
      ignoreInitial: true,
      interval: this.config.watchInterval
    });

    watcher.on('all', (event, path) => {
      callback({
        event,
        path,
        timestamp: new Date()
      });
    });

    // 返回停止监控的函数
    return () => {
      watcher.close();
    };
  }

  /**
   * 确保目录存在
   * @private
   */
  async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * 创建文件备份
   * @private
   */
  async createBackup(filePath) {
    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) return;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${filePath}.backup.${timestamp}`;
      
      await fs.copyFile(filePath, backupPath);
      
      // 清理旧备份
      await this.cleanupBackups(filePath);
    } catch (error) {
      console.warn(`创建备份失败 ${filePath}: ${error.message}`);
    }
  }

  /**
   * 清理旧备份文件
   * @private
   */
  async cleanupBackups(filePath) {
    try {
      const dir = path.dirname(filePath);
      const basename = path.basename(filePath);
      const entries = await fs.readdir(dir);
      
      const backups = entries
        .filter(name => name.startsWith(`${basename}.backup.`))
        .map(name => ({ name, path: path.join(dir, name) }))
        .sort((a, b) => b.name.localeCompare(a.name)); // 按时间倒序

      // 保留最新的 N 个备份
      if (backups.length > this.config.backupCount) {
        const toDelete = backups.slice(this.config.backupCount);
        for (const backup of toDelete) {
          await fs.unlink(backup.path);
        }
      }
    } catch (error) {
      console.warn(`清理备份失败 ${filePath}: ${error.message}`);
    }
  }

  /**
   * 检查是否应该忽略文件/目录
   * @private
   */
  shouldIgnore(fullPath) {
    const pathParts = fullPath.split(path.sep);
    return this.config.ignorePatterns.some(pattern => {
      return pathParts.some(part => part.includes(pattern));
    });
  }

  /**
   * 获取文件信息
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>} 文件信息
   */
  async getFileInfo(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const stats = await fs.stat(absolutePath);
      
      return {
        path: absolutePath,
        name: path.basename(absolutePath),
        directory: path.dirname(absolutePath),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        readable: true // 可以进一步检查权限
      };
    } catch (error) {
      throw new Error(`获取文件信息失败 ${filePath}: ${error.message}`);
    }
  }

  /**
   * 批量处理文件
   * @param {Array} files - 文件列表
   * @param {Function} processor - 处理函数
   * @param {Object} options - 选项
   * @returns {Promise<Array>} 处理结果
   */
  async processFiles(files, processor, options = {}) {
    const results = [];
    const concurrency = options.concurrency || 5;
    
    // 分批处理以避免过多并发
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      
      const batchPromises = batch.map(async (file, index) => {
        try {
          const result = await processor(file, i + index);
          return { file, success: true, result, error: null };
        } catch (error) {
          return { file, success: false, result: null, error: error.message };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }
}

module.exports = FileHelper;