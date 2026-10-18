const fs = require('fs');
const path = require('path');
const http = require('http');

async function main() {
  const logoPath = 'C:\\Users\\brayan\\OneDrive\\Desktop\\Logo_3_Escudo_TSS.jpg';
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDataUri = `data:image/jpeg;base64,${logoBase64}`;

  // Fetch rendered HTML from local Next.js dev server
  http.get('http://localhost:3000/dossier', (res) => {
    let rawHtml = '';
    res.on('data', (chunk) => { rawHtml += chunk; });
    res.on('end', () => {
      // Replace relative logo path with embedded base64 data uri
      let offlineHtml = rawHtml.replace(/\/technological-solutions-logo\.jpg/g, logoDataUri);

      // Save to Desktop
      const outputPath = 'C:\\Users\\brayan\\OneDrive\\Desktop\\Prestigia_Dossier_Offline.html';
      fs.writeFileSync(outputPath, offlineHtml, 'utf8');
      console.log('Successfully created:', outputPath);
    });
  }).on('error', (err) => {
    console.error('Error fetching dossier page:', err);
  });
}

main();
