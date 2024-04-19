require('dotenv-flow').config();
import express from 'express';
import { initializeEmailClient } from './init/initializeEmailClient';
import * as exampleFunctions from './examples';  // Importing all functions as an object
import { ExampleFunctions } from './examples';

declare global {
    var gmailClient: any;  // Global declaration for the Gmail client
}

const PORT = process.env.DEFAULT_URL
    ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338
    : 6338;

(async () => {
    const app = express();

    // Initialize the Gmail client and set it as a global variable
    const emailClientResult = await initializeEmailClient();
    global.gmailClient = emailClientResult.gmailClient;

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/files', express.static('dummyFiles'));

    const server = app.listen(PORT, () => {
        console.log('[Gmail-Node-Mailer Test Server] - Initialization Summary:');
        console.log('Server is listening on port:', PORT);
    });

    process.on('SIGINT', async () => {
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });

    // Assuming all functions exported from 'examples' return the same type of Promise
    type FunctionType = () => Promise<{ sent: boolean }>;

    // Now you can iterate over all the functions and log their results
    Object.keys(exampleFunctions).forEach(async funcKey => {
        const func = exampleFunctions[funcKey as keyof typeof exampleFunctions] as FunctionType;
        if (typeof func === 'function') {
            const result = await func();  // Call each function with proper typing
            console.log(`${funcKey} Email Send Result:`, result.sent);
        }
    });
})();
