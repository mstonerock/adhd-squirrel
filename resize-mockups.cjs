const sharp = require('sharp');
const fs = require('fs');

async function processMockups() {
  await sharp('C:\\Projects\\ADHD-Squirrel\\public\\Gemini_Generated_Image_d3u3qnd3u3qnd3u3.png')
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile('C:\\Projects\\ADHD-Squirrel\\public\\images\\products\\shirt-mockup.jpg');
    
  await sharp('C:\\Projects\\ADHD-Squirrel\\public\\Gemini_Generated_Image_wr5o9awr5o9awr5o.png')
    .resize({ width: 800, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile('C:\\Projects\\ADHD-Squirrel\\public\\images\\products\\hoodie-mockup.jpg');

  // Clean up the massive PNGs after processing
  fs.unlinkSync('C:\\Projects\\ADHD-Squirrel\\public\\Gemini_Generated_Image_d3u3qnd3u3qnd3u3.png');
  fs.unlinkSync('C:\\Projects\\ADHD-Squirrel\\public\\Gemini_Generated_Image_wr5o9awr5o9awr5o.png');
  console.log("Mockups processed and original PNGs cleaned up.");
}

processMockups().catch(console.error);
