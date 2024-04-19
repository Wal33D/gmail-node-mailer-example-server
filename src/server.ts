require('dotenv-flow').config();
import express from 'express';
import { initializeEmailClient } from './init/initializeEmailClient';
import { sendSubscriptionRenewalEmail } from './examples/sendSubscriptionRenewalEmail';
import { sendNewPurchaseEmail } from './examples/sendNewPurchaseEmail';
import { sendServerStatusEmail } from './examples/sendServerStatusEmail';
import { sendHtmlEmail } from './examples/sendHtmlEmail';
import { sendPlainTextEmail } from './examples/sendPlainTextEmail';
import { sendHtmlEmailWithAttachment } from './examples/sendHtmlEmailWithAttachment';

declare global {
    var gmailClient: any;
}

(async () => {
    const app = express();

    const emailClientResult = await initializeEmailClient();
    global.gmailClient = emailClientResult.gmailClient;

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());    

    // Serve static files from the dummyFiles directory
    app.use('/files', express.static('dummyFiles'));

    // Send a server start status email
    const serverStartResult = await sendServerStatusEmail('start');
    console.log('Server Start Email Send Result:', serverStartResult.sent);

    const server = app.listen(process.env.DEFAULT_PORT || 6338, () => {
        console.log('[Gmail-Node-Mailer Test Server] - Initialization Summary:');
        console.log('Server is listening on port:', process.env.DEFAULT_PORT || 6338);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        // Send server shutdown status email
        const serverStartResult = await sendServerStatusEmail('shutdown');
        console.log('Server Shutdown Email Send Result:', serverStartResult.sent);

        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });

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
