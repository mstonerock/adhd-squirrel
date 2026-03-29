const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\DEV\\Downloads\\kittl';
const targetDir = 'C:\\Projects\\ADHD-Squirrel\\public\\images';

const files = ['ADHD2.png', 'ADHD3.png', 'ADHD4.png'];

async function processImages() {
  for (let i = 0; i < files.length; i++) {
    const src = path.join(srcDir, files[i]);
    const dest = path.join(targetDir, `${i + 1}.png`);
    
    // Resize down to max 1000px width/height and compress
    await sharp(src)
      .resize({ width: 1000, withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(dest);
      
    console.log(`Resized ${files[i]} -> ${i + 1}.png`);
  }
}

processImages().catch(console.error);
