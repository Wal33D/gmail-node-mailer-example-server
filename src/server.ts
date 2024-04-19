require('dotenv-flow').config();

import express from 'express';

import { ISendEmailResponse } from 'gmail-node-mailer/dist/types';
import { initializeEmailClient } from './init/initializeEmailClient';
import * as examples from './examples'; // Importing from examples index


declare global {
    var gmailClient: any; // Global declaration for the Gmail client
}

const PORT = process.env.DEFAULT_URL
    ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338
    : 6338;

(async () => {
    const app = express();

    // Initialize the Gmail client and set it as a global variable
    const emailClientResult = await initializeEmailClient();
    global.gmailClient = emailClientResult.gmailClient;

    // Middleware to parse URL-encoded data and JSON
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Static file serving for downloadable content in the dummyFiles directory
    app.use('/files', express.static('dummyFiles'));

    // Send a notification email when the server starts
    const serverStartResult: ISendEmailResponse = await examples.sendServerStatusEmail('start');
    console.log('Server Start Email Send Result:', serverStartResult.sent);

    // Start the server on the specified port and log the initialization summary
    const server = app.listen(PORT, () => {
        console.log('[Gmail-Node-Mailer Test Server] - Initialization Summary:');
        console.log('Server is listening on port:', PORT);
    });

    // Setup graceful shutdown handling when receiving SIGINT (Ctrl+C)
    process.on('SIGINT', async () => {
        // Notify about server shutdown via email
        const serverStartResult: ISendEmailResponse = await examples.sendServerStatusEmail('shutdown');
        console.log('Server Shutdown Email Send Result:', serverStartResult.sent);

        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });

    // Demonstrate various email sending functionalities
    const sendHTMLEmailResult = await examples.sendHtmlEmail();
    console.log('Service Notification Email Send Result:', sendHTMLEmailResult.sent);

    const plainTextEmailResult: ISendEmailResponse = await examples.sendPlainTextEmail();
    console.log('Plain Text Email Send Result:', plainTextEmailResult.sent);

    const htmlEmailWithAttachmentResult:ISendEmailResponse = await examples.sendHtmlEmailWithAttachment();
    console.log('HTML Email with Attachment Send Result:', htmlEmailWithAttachmentResult.sent);

    const sendSubscriptionRenewalResult:ISendEmailResponse = await examples.sendSubscriptionRenewalEmail();
    console.log(`Send Subscription Renewal Email Result:`, sendSubscriptionRenewalResult.sent);

    const sendNewPurchaseResult:ISendEmailResponse = await examples.sendNewPurchaseEmail();
    console.log(`Send New Purchase Email Result:`, sendNewPurchaseResult.sent);

})();
