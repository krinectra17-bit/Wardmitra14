const sharp = require('sharp');
const path = require('path');

async function createCleanHero() {
  const inputPath = path.join(__dirname, '../public/images/ward14-hero.png');
  const outputPath = path.join(__dirname, '../public/images/ward14-clean-hero.png');

  // Exact coordinates:
  // Top: 138px (crops out the top ribbon tip)
  // Height: 422px (preserves folded hands and forearms, cleanly fades before white card)
  // Left: 0px, Width: 730px (perfect portrait framing around both candidates and temple)
  const cropTop = 138;
  const cropHeight = 422;
  const cropWidth = 730;

  const svgOverlay = `
    <svg width="${cropWidth}" height="${cropHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leftCreamBlend" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="1" />
          <stop offset="85%" stop-color="#FAF6F0" stop-opacity="1" />
          <stop offset="96%" stop-color="#FAF6F0" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="bottomCreamBlend" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0" />
          <stop offset="50%" stop-color="#FAF6F0" stop-opacity="0.4" />
          <stop offset="85%" stop-color="#FAF6F0" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="1" />
        </linearGradient>
        <linearGradient id="rightEdgeBlend" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0" />
          <stop offset="70%" stop-color="#FAF6F0" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="1" />
        </linearGradient>
      </defs>

      <!-- 1. Left side slogan cover: Solid cream up to X=235 -->
      <rect x="0" y="0" width="250" height="${cropHeight}" fill="url(#leftCreamBlend)" />

      <!-- 2. Bottom gentle fade into the cream canvas -->
      <rect x="0" y="375" width="${cropWidth}" height="47" fill="url(#bottomCreamBlend)" />

      <!-- 3. Right edge soft blend -->
      <rect x="705" y="0" width="25" height="${cropHeight}" fill="url(#rightEdgeBlend)" />
    </svg>
  `;

  await sharp(inputPath)
    .extract({ left: 0, top: cropTop, width: cropWidth, height: cropHeight })
    .composite([
      { input: Buffer.from(svgOverlay), top: 0, left: 0 }
    ])
    .modulate({
      saturation: 1.12, // Rich, vibrant, vivid natural colors
      brightness: 1.02,
    })
    .png()
    .toFile(outputPath);

  console.log('Clean hero generated successfully at:', outputPath);
}

createCleanHero().catch(console.error);
