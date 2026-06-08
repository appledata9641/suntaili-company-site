const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const files = [
  'public/downloads/manual/AC-525D.pdf',
  'public/downloads/manual/AC-526D.pdf',
  'public/downloads/manual/AC-535.pdf',
  'public/downloads/manual/AC-536.pdf',
].map((p) => path.resolve(process.cwd(), p));

(async function extract() {
  for (const file of files) {
    try {
      const data = fs.readFileSync(file);
      const res = await pdfParse(data);
      const text = res.text.replace(/\r\n/g, '\n');
      console.log('-----FILE_START-----');
      console.log(file);
      console.log('-----TEXT_START-----');
      console.log(text.slice(0, 3000)); // print first 3000 chars
      console.log('-----TEXT_END-----');
      const outPath = path.join(process.cwd(), 'scripts', path.basename(file) + '.txt');
      fs.writeFileSync(outPath, text, 'utf8');
      console.log('Saved full text to', outPath);
    } catch (err) {
      console.error('Error processing', file, err && err.message);
    }
  }
})();
