const FileHelper = require('../index.js');

async function basicExample() {
  console.log('=== 文件助手技能基本示例 ===\n');
  
  // 创建文件助手实例
  const fileHelper = new FileHelper({
    maxFileSize: '10MB',
    watchInterval: 1000,
    backupEnabled: true,
    backupCount: 3
  });

  try {
    // 1. 写入文件
    console.log('1. 写入文件...');
    await fileHelper.writeFile('./example-data.txt', 'Hello, FileHelper!\n这是一个示例文件。\n');
    console.log('✓ 文件写入成功\n');

    // 2. 读取文件
    console.log('2. 读取文件...');
    const content = await fileHelper.readFile('./example-data.txt');
    console.log('文件内容:');
    console.log(content);
    console.log('✓ 文件读取成功\n');

    // 3. 获取文件信息
    console.log('3. 获取文件信息...');
    const fileInfo = await fileHelper.getFileInfo('./example-data.txt');
    console.log('文件信息:');
    console.log(`- 文件名: ${fileInfo.name}`);
    console.log(`- 大小: ${fileInfo.size} bytes`);
    console.log(`- 修改时间: ${fileInfo.modified}`);
    console.log('✓ 文件信息获取成功\n');

    // 4. 文件搜索
    console.log('4. 搜索文件...');
    const jsFiles = await fileHelper.search('.', '.js');
    console.log(`找到 ${jsFiles.length} 个 JS 文件:`);
    jsFiles.slice(0, 5).forEach(file => {
      console.log(`- ${file.name} (${file.size} bytes)`);
    });
    console.log('✓ 文件搜索成功\n');

  } catch (error) {
    console.error('示例执行失败:', error.message);
  }
}

async function batchProcessingExample() {
  console.log('=== 批量处理示例 ===\n');
  
  const fileHelper = new FileHelper();
  
  try {
    // 搜索所有 JS 文件
    const jsFiles = await fileHelper.search('.', '.js');
    
    if (jsFiles.length === 0) {
      console.log('没有找到 JS 文件');
      return;
    }

    console.log(`批量处理 ${jsFiles.length} 个 JS 文件...\n`);
    
    // 定义处理函数：统计代码行数
    const lineCounter = async (fileInfo) => {
      const content = await fileHelper.readFile(fileInfo.path);
      const lines = content.split('\n').length;
      const nonEmptyLines = content.split('\n').filter(line => line.trim()).length;
      
      return {
        file: fileInfo.name,
        totalLines: lines,
        codeLines: nonEmptyLines,
        emptyLines: lines - nonEmptyLines
      };
    };

    // 批量处理
    const results = await fileHelper.processFiles(
      jsFiles.map(f => f.path),
      lineCounter,
      { concurrency: 3 }
    );

    // 统计结果
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`处理完成: ${successful.length} 成功, ${failed.length} 失败\n`);
    
    // 显示前几个成功的结果
    successful.slice(0, 5).forEach(result => {
      const { file, totalLines, codeLines, emptyLines } = result.result;
      console.log(`📄 ${file}`);
      console.log(`   总行数: ${totalLines}, 代码行: ${codeLines}, 空行: ${emptyLines}`);
    });
    
    // 显示统计信息
    const totalStats = successful.reduce((acc, result) => {
      const r = result.result;
      return {
        totalLines: acc.totalLines + r.totalLines,
        codeLines: acc.codeLines + r.codeLines,
        emptyLines: acc.emptyLines + r.emptyLines
      };
    }, { totalLines: 0, codeLines: 0, emptyLines: 0 });
    
    console.log('\n📊 统计信息:');
    console.log(`   总行数: ${totalStats.totalLines}`);
    console.log(`   代码行数: ${totalStats.codeLines}`);
    console.log(`   空行数: ${totalStats.emptyLines}`);
    
  } catch (error) {
    console.error('批量处理失败:', error.message);
  }
}

async function watchExample() {
  console.log('=== 文件监控示例 ===\n');
  
  const fileHelper = new FileHelper();
  const watchFile = './watch-example.txt';
  
  try {
    // 创建初始文件
    await fileHelper.writeFile(watchFile, '初始内容\n');
    console.log(`开始监控文件: ${watchFile}`);
    console.log('请手动修改文件内容，或按 Ctrl+C 停止监控...\n');
    
    // 设置监控
    const stopWatching = fileHelper.watchFile(watchFile, (event) => {
      console.log(`📝 文件变更通知:`);
      console.log(`   事件类型: ${event.event}`);
      console.log(`   文件路径: ${event.path}`);
      console.log(`   变更时间: ${event.timestamp.toLocaleString()}`);
      console.log('');
    });
    
    // 监控 10 秒后自动停止（仅用于演示）
    setTimeout(() => {
      console.log('停止监控...');
      stopWatching();
      process.exit(0);
    }, 10000);
    
  } catch (error) {
    console.error('监控设置失败:', error.message);
  }
}

// 主函数
async function main() {
  console.log('🚀 文件助手技能演示\n');
  
  const args = process.argv.slice(2);
  const example = args[0] || 'basic';
  
  switch (example) {
    case 'basic':
      await basicExample();
      break;
    case 'batch':
      await batchProcessingExample();
      break;
    case 'watch':
      await watchExample();
      break;
    default:
      console.log('可用示例:');
      console.log('  node examples/basic.js      - 基本功能演示');
      console.log('  node examples/basic.js batch - 批量处理演示');
      console.log('  node examples/basic.js watch - 文件监控演示');
  }
}

// 处理未捕获的异常
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  basicExample,
  batchProcessingExample,
  watchExample
};