// Load environment variables from .env files with dotenv-flow
require('dotenv-flow').config();
import express from 'express';
// Importing function to initialize the email client
import { initializeEmailClient } from './init/initializeEmailClient';
// Importing specific email example functions
import { sendSubscriptionRenewalEmail } from './examples/sendSubscriptionRenewalEmail';
import { sendNewPurchaseEmail } from './examples/sendNewPurchaseEmail';
import { sendServerStatusEmail } from './examples/sendServerStatusEmail';
import { sendHtmlEmail } from './examples/sendHtmlEmail';
import { sendPlainTextEmail } from './examples/sendPlainTextEmail';
import { sendHtmlEmailWithAttachment } from './examples/sendHtmlEmailWithAttachment';

declare global {
    var gmailClient: any; // Global declaration for the Gmail client
}

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
    const serverStartResult = await sendServerStatusEmail('start');
    console.log('Server Start Email Send Result:', serverStartResult.sent);

    // Start the server on the specified port and log the initialization summary
    const server = app.listen(process.env.DEFAULT_PORT || 6338, () => {
        console.log('[Gmail-Node-Mailer Test Server] - Initialization Summary:');
        console.log('Server is listening on port:', process.env.DEFAULT_PORT || 6338);
    });

    // Setup graceful shutdown handling when receiving SIGINT (Ctrl+C)
    process.on('SIGINT', async () => {
        // Notify about server shutdown via email
        const serverStartResult = await sendServerStatusEmail('shutdown');
        console.log('Server Shutdown Email Send Result:', serverStartResult.sent);

        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });

    // Demonstrate various email sending functionalities
    const sendHTMLEmailResult = await sendHtmlEmail();
    console.log('Service Notification Email Send Result:', sendHTMLEmailResult.sent);

    const plainTextEmailResult = await sendPlainTextEmail();
    console.log('Plain Text Email Send Result:', plainTextEmailResult.sent);

    const htmlEmailWithAttachmentResult = await sendHtmlEmailWithAttachment();
    console.log('HTML Email with Attachment Send Result:', htmlEmailWithAttachmentResult.sent);

    const sendSubscriptionRenewalResult = await sendSubscriptionRenewalEmail();
    console.log(`Send Subscription Renewal Email Result:`, sendSubscriptionRenewalResult.sent);

    const sendNewPurchaseResult = await sendNewPurchaseEmail();
    console.log(`Send New Purchase Email Result:`, sendNewPurchaseResult.sent);

})();
