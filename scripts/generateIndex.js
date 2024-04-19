const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src/examples');
const exportFileContents = [];
const functionNames = [];

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    files.forEach(file => {
        if (file.endsWith('.ts') && file !== 'index.ts') { 
            const moduleName = path.basename(file, '.ts');
            // Directly export the named function
            exportFileContents.push(`export * from './${moduleName}';`);
            functionNames.push(moduleName);
        }
    });

    // Adding type definitions if there are functions to include
    if (functionNames.length > 0) {
        const typeDefinitions = `export type ExampleFunctions = {\n${functionNames.map(name => `    ${name}: () => Promise<{ sent: boolean }>;`).join('\n')}\n};`;
        exportFileContents.push(typeDefinitions);
    }

    fs.writeFileSync(path.join(directoryPath, 'index.ts'), exportFileContents.join('\n'));
});
