const sharp = require('sharp');
const path = require('path');

async function makePerfectHero() {
  const inputPath = path.join(__dirname, '../public/images/ward14-hero.png');
  const outputPath = path.join(__dirname, '../public/images/ward14-perfect-hero.png');

  // Exact coordinates on original 859 x 1024 image:
  // Left: 235
  // Top: 105 (gives even more generous sky clearance above Manish-ji's hair, hair starts at 112)
  // Width: 485
  // Height: 435 (captures down to y=540, right before the bottom placard at y=542)
  const cropLeft = 235;
  const cropTop = 105;
  const cropWidth = 485;
  const cropHeight = 435;

  // Let's create an SVG mask/overlay:
  // 1. Top-right: solid clean sky cover without blurred edge leakage (from x=360 to 485, y=0 to 35)
  //    Sky color in that top region transitions softly from #FAF6F0
  // 2. Top-left: clean sky blend (from x=0 to 180, y=0 to 20)
  // 3. Left edge: soft fade into #FAF6F0
  // 4. Right edge: subtle soft edge into #FAF6F0
  // 5. Bottom edge: smooth fade into #FAF6F0 so it seamlessly melts into the page canvas
  const svgOverlay = `
    <svg width="${cropWidth}" height="${cropHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGradRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="1" />
          <stop offset="80%" stop-color="#FAF6F0" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="skyGradLeft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="1" />
          <stop offset="75%" stop-color="#FAF6F0" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="bottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0" />
          <stop offset="50%" stop-color="#FAF6F0" stop-opacity="0.4" />
          <stop offset="85%" stop-color="#FAF6F0" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="1" />
        </linearGradient>
        <linearGradient id="leftFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="1" />
          <stop offset="40%" stop-color="#FAF6F0" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="rightFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FAF6F0" stop-opacity="0" />
          <stop offset="60%" stop-color="#FAF6F0" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#FAF6F0" stop-opacity="1" />
        </linearGradient>
      </defs>

      <!-- 1. Top-left sky (veil starts below y=70, so y=0..30 is 100% sky) -->
      <rect x="0" y="0" width="205" height="18" fill="#FAF6F0" />
      <rect x="0" y="16" width="205" height="20" fill="url(#skyGradLeft)" />

      <!-- 2. Top-right sky & slogan cover: solid fill at the top edge so no text leaks -->
      <rect x="370" y="0" width="115" height="22" fill="#FAF6F0" />
      <rect x="370" y="20" width="115" height="25" fill="url(#skyGradRight)" />

      <!-- 3. Soft Left Edge into canvas -->
      <rect x="0" y="0" width="22" height="${cropHeight}" fill="url(#leftFade)" />

      <!-- 4. Soft Right Edge into canvas -->
      <rect x="${cropWidth - 25}" y="0" width="25" height="${cropHeight}" fill="url(#rightFade)" />

      <!-- 5. Bottom seamless fade into canvas -->
      <rect x="0" y="${cropHeight - 45}" width="${cropWidth}" height="45" fill="url(#bottomFade)" />
    </svg>
  `;

  await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .composite([
      { input: Buffer.from(svgOverlay), top: 0, left: 0 }
    ])
    .modulate({
      saturation: 1.08, // Rich natural skin and textile color
      brightness: 1.01,
    })
    .png()
    .toFile(outputPath);

  console.log('Created ward14-perfect-hero.png successfully!');
}

makePerfectHero().catch(console.error);
