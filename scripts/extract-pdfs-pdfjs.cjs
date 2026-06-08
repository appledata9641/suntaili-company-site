const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const files = [
  'public/downloads/manual/AC-525D.pdf',
  'public/downloads/manual/AC-526D.pdf',
  'public/downloads/manual/AC-535.pdf',
  'public/downloads/manual/AC-536.pdf',
].map((p) => path.resolve(process.cwd(), p));

async function extractFile(file) {
  const data = new Uint8Array(fs.readFileSync(file));
  const loadingTask = pdfjsLib.getDocument({data});
  const doc = await loadingTask.promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strs = content.items.map((item) => item.str);
    fullText += strs.join(' ') + '\n\n';
  }
  return fullText;
}

(async function(){
  for (const file of files) {
    try {
      console.log('-----FILE_START-----');
      console.log(file);
      const text = await extractFile(file);
      console.log('-----TEXT_START-----');
      console.log(text.slice(0,3000));
      console.log('-----TEXT_END-----');
      const outPath = path.join(process.cwd(), 'scripts', path.basename(file) + '.txt');
      fs.writeFileSync(outPath, text, 'utf8');
      console.log('Saved full text to', outPath);
    } catch (err) {
      console.error('Error', file, err && err.message);
    }
  }
})();
