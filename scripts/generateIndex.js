const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src/examples');
const exportFileContents = [];

// Read through the examples directory and export all TypeScript files except index.ts
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    files.forEach(file => {
        if (file.endsWith('.ts') && file !== 'index.ts') {
            const moduleName = path.basename(file, '.ts');
            exportFileContents.push(`export * from './${moduleName}';`);
        }
    });

    // Write the content to index.ts in the examples directory
    fs.writeFileSync(path.join(directoryPath, 'index.ts'), exportFileContents.join('\n'));
});
