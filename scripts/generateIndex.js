const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src/examples');
const exportFileContents = [];

// Start by defining a common function type for all example functions
exportFileContents.push(`export type FunctionType = () => Promise<{ sent: boolean }>;`);

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
