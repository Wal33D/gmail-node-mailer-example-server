const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'examples'); 
const exportFileContents = [];

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

    fs.writeFileSync(path.join(directoryPath, 'index.ts'), exportFileContents.join('\n'));
});
