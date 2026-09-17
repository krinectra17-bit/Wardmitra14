const sharp = require('sharp');
const path = require('path');

async function restoreHero() {
  const inputPath = path.join(__dirname, '../public/images/ward14-hero.png');
  const outputPath = path.join(__dirname, '../public/images/ward14-editorial-hero.png');

  // Load original metadata
  const meta = await sharp(inputPath).metadata();
  console.log('Original dimensions:', meta.width, 'x', meta.height);

  // We keep Y from 0 to 570!
  // Top Y=0 preserves the complete sky, temple spire, and 100% of the gentleman's hair!
  // Bottom Y=570 preserves their full upper body and folded hands in Namaste.
  const cropTop = 0;
  const cropHeight = 570;
  const cropWidth = 859;

  // Let's create an SVG mask that covers ONLY the printed poster text:
  // 1. Top-Left: BJP logo & text (x: 0 to 480, y: 0 to 115) - smooth sky gradient matching the sky
  // 2. Top-Right: Slogan in sky (x: 680 to 859, y: 0 to 125) - sky gradient
  // 3. Left Slogan: "साथ मिलकर एक बेहतर..." (x: 0 to 230, y: 160 to 360) - smoothly dissolves into #FAF6F0
  // 4. Right Pillar Text: "हमारा वार्ड 14 हमारी पहचान" (x: 740 to 859, y: 280 to 520) - matching sandstone gradient
  // 5. Bottom: smooth fade into #FAF6F0 starting at y: 500 down to y: 570 (below their hands)
  
  const svgOverlay = `
    <svg width="${cropWidth}" height="${cropHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Soft feather filter so edges are invisible -->
        <filter id="softFeather" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="gentleBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        <!-- Sky gradient for top-left (pure light sky matching the photo) -->
        <linearGradient id="topLeftSky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="1" />
          <stop offset="60%" stop-color="#FBF8F2" stop-opacity="0.98" />
          <stop offset="90%" stop-color="#FBF8F2" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#FBF8F2" stop-opacity="0" />
        </linearGradient>

        <!-- Sky gradient for top-right -->
        <linearGradient id="topRightSky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDFBF7" stop-opacity="0" />
          <stop offset="30%" stop-color="#FAF6F0" stop-opacity="0.7" />
          <stop offset="70%" stop-color="#FAF6F0" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="1" />
        </linearGradient>

        <!-- Left transition into cream background: ends before the lady's saree at X=240 -->
        <linearGradient id="leftFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="1" />
          <stop offset="75%" stop-color="#FAF6F0" stop-opacity="1" />
          <stop offset="92%" stop-color="#FAF6F0" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0" />
        </linearGradient>

        <!-- Sandstone pillar tint for the right text -->
        <linearGradient id="sandstonePillar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ceb8a3" stop-opacity="0.98" />
          <stop offset="50%" stop-color="#c5ae98" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#b69e89" stop-opacity="0.98" />
        </linearGradient>

        <!-- Bottom fade into cream canvas below their folded hands -->
        <linearGradient id="bottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0" />
          <stop offset="40%" stop-color="#FAF6F0" stop-opacity="0.3" />
          <stop offset="75%" stop-color="#FAF6F0" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="1" />
        </linearGradient>
      </defs>

      <!-- 1. Top-left BJP header removal (covers x: 0 to 470, y: 0 to 110, stops well before man's hair at x=540) -->
      <path d="M 0,0 L 460,0 Q 470,60 420,105 L 0,110 Z" fill="url(#topLeftSky)" filter="url(#gentleBlur)" />

      <!-- 2. Top-right slogan removal in the sky (x: 700 to 859, y: 0 to 120) -->
      <rect x="690" y="0" width="169" height="120" fill="url(#topRightSky)" filter="url(#gentleBlur)" />

      <!-- 3. Left slogan removal (covers x: 0 to 235, y: 110 to 520, dissolves smoothly into #FAF6F0) -->
      <rect x="0" y="110" width="245" height="410" fill="url(#leftFade)" />

      <!-- 4. Right pillar text removal (covers x: 745 to 859, y: 280 to 520) -->
      <rect x="742" y="280" width="117" height="240" rx="8" fill="url(#sandstonePillar)" filter="url(#softFeather)" />

      <!-- 5. Bottom edge fade below hands (y: 500 to 570) -->
      <rect x="0" y="500" width="${cropWidth}" height="70" fill="url(#bottomFade)" />
    </svg>
  `;

  await sharp(inputPath)
    .extract({ left: 0, top: cropTop, width: cropWidth, height: cropHeight })
    .composite([
      { input: Buffer.from(svgOverlay), top: 0, left: 0 }
    ])
    .modulate({
      saturation: 1.08, // 100% natural, vibrant skin & clothing tones
      brightness: 1.01,
    })
    .png()
    .toFile(outputPath);

  console.log('Successfully generated ward14-editorial-hero.png');
}

restoreHero().catch(err => {
  console.error(err);
  process.exit(1);
});
