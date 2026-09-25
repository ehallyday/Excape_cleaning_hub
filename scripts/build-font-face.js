// Generates the self-hosted @font-face block from unicode-ranges.json,
// reproducing exactly the weight/subset combinations Google Fonts served
// for this page (verified against the live Roboto/Poppins CSS response).
const fs = require('fs');
const path = require('path');

const ranges = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'unicode-ranges.json'), 'utf8'));

const faces = [
  // Roboto latin — shared variable-font resource, one file, three declared weights
  { family: 'Roboto', weight: 400, file: 'roboto-latin.woff2', range: ranges.Roboto_latin },
  { family: 'Roboto', weight: 500, file: 'roboto-latin.woff2', range: ranges.Roboto_latin },
  { family: 'Roboto', weight: 700, file: 'roboto-latin.woff2', range: ranges.Roboto_latin },
  // Roboto math — covers the "→" arrow glyph used in "Get Quote →" / "read them all →"
  { family: 'Roboto', weight: 400, file: 'roboto-math.woff2', range: ranges.Roboto_math },
  { family: 'Roboto', weight: 500, file: 'roboto-math.woff2', range: ranges.Roboto_math },
  { family: 'Roboto', weight: 700, file: 'roboto-math.woff2', range: ranges.Roboto_math },
  // Roboto symbols — covers the "★" glyph used in "4.8★"
  { family: 'Roboto', weight: 400, file: 'roboto-symbols.woff2', range: ranges.Roboto_symbols },
  { family: 'Roboto', weight: 500, file: 'roboto-symbols.woff2', range: ranges.Roboto_symbols },
  { family: 'Roboto', weight: 700, file: 'roboto-symbols.woff2', range: ranges.Roboto_symbols },
  // Poppins latin — distinct static file per weight
  { family: 'Poppins', weight: 600, file: 'poppins-600-latin.woff2', range: ranges.Poppins_latin },
  { family: 'Poppins', weight: 700, file: 'poppins-700-latin.woff2', range: ranges.Poppins_latin },
  { family: 'Poppins', weight: 800, file: 'poppins-800-latin.woff2', range: ranges.Poppins_latin },
];

const css = faces.map(f => `@font-face {
  font-family: '${f.family}';
  font-style: normal;
  font-weight: ${f.weight};
  font-display: swap;
  src: url('../fonts/${f.file}') format('woff2');
  unicode-range: ${f.range};
}`).join('\n\n');

fs.writeFileSync(path.join(__dirname, '..', 'src', 'fonts.css'), css + '\n');
console.log('Wrote src/fonts.css with', faces.length, 'font-face rules');
