const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

async function convertPngToWebp() {
  const inputDir = './images/practical';
  const backupDir = './images/practical/_original_png_backup';
  
  try {
    // PNG 파일 목록 가져오기
    const files = await fs.readdir(inputDir);
    const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
    
    console.log(`Found ${pngFiles.length} PNG files to convert`);
    
    // ffmpeg 사용 가능 여부 확인
    try {
      await execPromise('ffmpeg -version');
      console.log('Using ffmpeg for conversion...');
      
      let converted = 0;
      for (const file of pngFiles) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(inputDir, file.replace(/\.png$/i, '.webp'));
        
        try {
          await execPromise(`ffmpeg -i "${inputPath}" -quality 80 "${outputPath}" -y`);
          console.log(`✓ Converted: ${file} → ${file.replace(/\.png$/i, '.webp')}`);
          converted++;
        } catch (err) {
          console.error(`✗ Failed: ${file}`, err.message);
        }
      }
      
      console.log(`\nConversion complete: ${converted}/${pngFiles.length} files`);
      console.log('\nTo backup original PNG files, run:');
      console.log(`Move-Item "${inputDir}/*.png" "${backupDir}"`);
      
    } catch (err) {
      console.error('ffmpeg not found. Please install ffmpeg or use online tools.');
      console.error('Download: https://www.ffmpeg.org/download.html');
      process.exit(1);
    }
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

convertPngToWebp();
