const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'public', 'logo', 'favicon-source.png');

async function generate() {
  try {
    console.log('Reading source image...', sourceFile);
    
    // First, let's trim the transparent/white border around the AJ monogram logo
    // the logo is on a white or transparent background, we can trim it automatically.
    const image = sharp(sourceFile);
    
    // Trim the whitespace and get bounding boxes
    const trimmed = await image.clone().trim().toBuffer();
    
    // Let's create different sizes
    const sizes = [
      { name: 'favicon-16x16.png', size: 16 },
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'android-chrome-192x192.png', size: 192 },
      { name: 'android-chrome-512x512.png', size: 512 },
      { name: 'apple-touch-icon.png', size: 180 }
    ];

    for (const s of sizes) {
      const outputPath = path.join(__dirname, 'public', s.name);
      // Resize the trimmed image to fit nicely (with a tiny 2px padding for aesthetics)
      const padding = Math.max(1, Math.round(s.size * 0.05)); // 5% padding
      const innerSize = s.size - padding * 2;
      
      await sharp(trimmed)
        .resize(innerSize, innerSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(outputPath);
      console.log(`Generated ${s.name}`);
    }

    // Generate favicon.ico (usually contains multiple sizes, but we can do a high quality 32x32 or 48x48 png renamed or wrapped)
    const icoPath = path.join(__dirname, 'public', 'favicon.ico');
    const trimmedBuffer = await sharp(trimmed)
      .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFormat('png')
      .toBuffer();
    
    fs.writeFileSync(icoPath, trimmedBuffer);
    console.log('Generated favicon.ico');
    
    console.log('Favicon generation completed successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generate();
