import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const { imagePairs, theme } = await request.json();

    if (!imagePairs || !Array.isArray(imagePairs) || imagePairs.length === 0) {
      return NextResponse.json({ error: 'Missing image pairs' }, { status: 400 });
    }

    const bgRgb = theme?.rgb || { r: 247, g: 186, b: 201, alpha: 1 }; // Default pink

    const rowHeight = 400; // Fixed height for each photo
    
    // Download and resize all images
    const composites = [];
    
    const gapX = 0; // Seamless connection between the two people
    const gapY = 20; // Gap between the rows
    const padding = 40; // Side and top padding
    const bottomPadding = 180; // Large bottom padding for text
    
    let totalWidth = 0;
    let currentY = padding;
    
    for (const pair of imagePairs) {
      const [resLeft, resRight] = await Promise.all([
        fetch(pair.left),
        fetch(pair.right)
      ]);
      
      const bufferLeft = await resLeft.arrayBuffer();
      const bufferRight = await resRight.arrayBuffer();
      
      const cropWidth = 300;
      const cropHeight = rowHeight; // 400

      const imgLeft = await sharp(Buffer.from(bufferLeft))
        .resize(cropWidth, cropHeight, { fit: 'cover', position: 'center' })
        .toBuffer();
      const imgRight = await sharp(Buffer.from(bufferRight))
        .resize(cropWidth, cropHeight, { fit: 'cover', position: 'center' })
        .toBuffer();
      
      const wLeft = cropWidth;
      const wRight = cropWidth;
      
      if (totalWidth === 0) {
        totalWidth = padding + wLeft + gapX + wRight + padding;
      }
      
      composites.push({ input: imgLeft, top: currentY, left: padding });
      composites.push({ input: imgRight, top: currentY, left: padding + wLeft + gapX });
      
      currentY += rowHeight + gapY;
    }
    
    // Remove the last gapY and add the large polaroid bottom padding
    const totalHeight = currentY - gapY + bottomPadding;

    // Pattern generation
    if (theme && theme.type === 'pattern') {
      const pRgb = theme.rgb;
      const sRgb = theme.secondaryRgb;
      
      const pColor = `rgba(${pRgb.r},${pRgb.g},${pRgb.b},1)`;
      const sColor = `rgba(${sRgb.r},${sRgb.g},${sRgb.b},1)`;
      
      let svgStr = '';
      if (theme.patternId === 'checkerboard') {
        svgStr = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="checker" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="${pColor}" />
              <rect width="20" height="20" fill="${sColor}" />
              <rect x="20" y="20" width="20" height="20" fill="${sColor}" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#checker)" />
        </svg>`;
      } else if (theme.patternId === 'dots') {
        svgStr = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="${pColor}" />
              <circle cx="15" cy="15" r="5" fill="${sColor}" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>`;
      } else if (theme.patternId === 'grid') {
        svgStr = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="${pColor}" />
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${sColor}" stroke-width="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>`;
      } else if (theme.patternId === 'gingham') {
        svgStr = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gingham" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="${pColor}" />
              <rect width="40" height="20" fill="${sColor}" fill-opacity="0.4" />
              <rect width="20" height="40" fill="${sColor}" fill-opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gingham)" />
        </svg>`;
      } else if (theme.patternId === 'stripes') {
        svgStr = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stripes" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="${pColor}" />
              <rect width="10" height="30" fill="${sColor}" />
              <rect x="25" width="2" height="30" fill="${sColor}" fill-opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stripes)" />
        </svg>`;
      } else if (theme.patternId === 'denim') {
        svgStr = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="denim" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="${pColor}" />
              <path d="M 10 0 L 10 80 M 70 0 L 70 80" fill="none" stroke="${sColor}" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.8" />
              <path d="M 25 25 L 55 25 L 55 50 L 40 65 L 25 50 Z" fill="none" stroke="${sColor}" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#denim)" />
        </svg>`;
      }

      if (svgStr) {
        // Insert pattern as the very first layer in composites
        composites.unshift({ input: Buffer.from(svgStr), top: 0, left: 0 });
      }
    }

    // Create background canvas based on chosen theme
    const base = sharp({
      create: {
        width: totalWidth,
        height: totalHeight,
        channels: 4,
        background: bgRgb
      }
    });

    // Composite all images onto the base
    const stitched = await base.composite(composites).png().toBuffer();

    const base64Image = `data:image/png;base64,${stitched.toString('base64')}`;

    return NextResponse.json({ stitchedImage: base64Image });

  } catch (error) {
    console.error('Stitching error:', error);
    return NextResponse.json({ error: 'Failed to stitch images' }, { status: 500 });
  }
}
