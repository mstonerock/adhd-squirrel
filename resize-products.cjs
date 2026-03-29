const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Projects\\ADHD-Squirrel\\src\\BigImages';
const targetDir = 'C:\\Projects\\ADHD-Squirrel\\public\\images\\products';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = ['6.png', 'ADHD2.png', 'ADHD3.png', 'ADHD4.png', 'ADHD5.png'];

async function processImages() {
  for (const file of files) {
    const src = path.join(srcDir, file);
    const destName = file.replace('.png', '.jpg');
    const dest = path.join(targetDir, destName);
    
    // Resize down to max 800px width/height and compress highly to speed up web and vision testing
    await sharp(src)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(dest);
      
    console.log(`Converted ${file} -> ${destName}`);
  }
}

processImages().catch(console.error);
