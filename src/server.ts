/**
 * Demonstration Module: gmail-node-mailer npm package Usage Examples
 *
 * This Express server application serves as a live demonstration platform for the 'gmail-node-mailer' package, showcasing various email sending scenarios using a simulated server environment.
 *
 * Demonstrations Include:
 *  - Email Types:
 *    - HTML Emails: Sends a stylized HTML email to illustrate how to include HTML content and styles in emails.
 *    - Plain Text Emails: Demonstrates sending simple text-based emails for scenarios where simplicity is key.
 *    - Emails with Attachments: Shows how to attach files (like PDFs and text files) to emails, suitable for invoices, reports, or promotional materials.
 *  - Sample Use Cases:
 *    - Subscription Renewal Emails: Sends detailed renewal confirmations with attachments, showcasing the package's utility in subscription-based services.
 *    - New Purchase Confirmations: Sends purchase confirmation emails, highlighting how to enhance customer purchase experiences with immediate confirmation.
 *    - Server Status Notifications: Automatically sends an email when the server starts or shuts down, demonstrating the package's capability to integrate with server lifecycle events.
 *
 * This server is particularly useful for developers looking to integrate email functionalities in their applications using 'gmail-node-mailer', providing practical, executable 
 *
 * Note:
 *  - The server requires certain environment variables to be set for proper configuration and operation.
 *  - Below is a sample `.env` configuration for setting up the server and email functionalities:
 *
 *    # === Server URL/PORT ===
 *    DEFAULT_URL=http://localhost:6338
 *
 *    # GmailMailer Config
 *    GMAIL_MAILER_SENDER_EMAIL=no-reply@somnuslabs.com
 *    GMAIL_MAILER_SERVICE_ACCOUNT_PATH=.\private\serviceAccount.json
 *    # Optional - you can use the path or a json object
 *    # GMAIL_MAILER_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"....iam.gserviceaccount.com","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
 */

require('dotenv-flow').config();

import express from 'express';
import opener from 'opener';

import { ISendEmailResponse } from 'gmail-node-mailer/dist/types';
import { initializeEmailClient } from './init/initializeEmailClient';
import { sendServerStatusEmail } from './examples/sendServerStatusEmail';
import { sendHtmlEmail } from './examples/sendHtmlEmail';
import { sendPlainTextEmail } from './examples/sendPlainTextEmail';
import { sendHtmlEmailWithAttachment } from './examples/sendHtmlEmailWithAttachment';
import { sendSubscriptionRenewalEmail } from './examples/sendSubscriptionRenewalEmail';
import { sendNewPurchaseEmail } from './examples/sendNewPurchaseEmail';

declare global {
    var gmailClient: any;
}

const PORT = process.env.DEFAULT_URL
    ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338
    : 6338;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/files', express.static('dummyFiles'));

// Menu for triggering email functions and simulating server status notifications
app.get('/', (req, res) => {
    res.send(`
        <head>
            <title>Gmail-Node-Mailer Test Server</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 40px; }
                h1 { color: #333; }
                ul { list-style-type: none; padding: 0; }
                li { margin: 10px 0; }
                a { text-decoration: none; color: darkblue; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>Gmail-Node-Mailer Test Server</h1>
            <p>Welcome to the Gmail-Node-Mailer Test Server. This tool allows you to test various email functionalities integrated with the Gmail API.</p>
            <p>For more information about the Gmail-Node-Mailer package, visit our <a href="https://github.com/our-node-packages/gmail-node-mailer" target="_blank">GitHub repository</a>.</p>
            <ul>
                <li><a href="/simulate-server-status" target="_blank">Simulate Server Status Emails</a></li>
                <li><a href="/send-html-email" target="_blank">Send HTML Email</a></li>
                <li><a href="/send-plain-text-email" target="_blank">Send Plain Text Email</a></li>
                <li><a href="/send-html-email-attachment" target="_blank">Send HTML Email with Attachment</a></li>
                <li><a href="/send-subscription-renewal" target="_blank">Send Subscription Renewal Email</a></li>
                <li><a href="/send-new-purchase" target="_blank">Send New Purchase Email</a></li>
            </ul>
        </body>
    `);
});

// Initialize the Gmail client
initializeEmailClient().then(emailClientResult => {
    global.gmailClient = emailClientResult.gmailClient;

    // Endpoint to simulate server start and stop notifications
    app.get('/simulate-server-status', async (req, res) => {
        console.log('[Demo] Simulating server start...');
        const startEmailResult: ISendEmailResponse = await sendServerStatusEmail('start');
        console.log('Server Start Email Send Result:', startEmailResult.sent);

        console.log('[Gmail-Node-Mailer Test Server] - Server is operating. Emails are ready to be sent.');

        console.log('[Demo] Simulating server shutdown...');
        const stopEmailResult: ISendEmailResponse = await sendServerStatusEmail('shutdown');
        console.log('Server Shutdown Email Send Result:', stopEmailResult.sent);

        res.send('<p>Simulated server start and stop. Status emails sent. Check console for details.</p>');
    });

    // Other email sending endpoints
    app.get('/send-html-email', async (req, res) => {
        const result: ISendEmailResponse = await sendHtmlEmail();
        res.send(`<p>HTML Email Sent: ${result.sent}</p>`);
    });

    app.get('/send-plain-text-email', async (req, res) => {
        const result: ISendEmailResponse = await sendPlainTextEmail();
        res.send(`<p>Plain Text Email Sent: ${result.sent}</p>`);
    });

    app.get('/send-html-email-attachment', async (req, res) => {
        const result: ISendEmailResponse = await sendHtmlEmailWithAttachment();
        res.send(`<p>HTML Email with Attachment Sent: ${result.sent}</p>`);
    });

    app.get('/send-subscription-renewal', async (req, res) => {
        const result: ISendEmailResponse = await sendSubscriptionRenewalEmail();
        res.send(`<p>Subscription Renewal Email Sent: ${result.sent}</p>`);
    });

    app.get('/send-new-purchase', async (req, res) => {
        const result: ISendEmailResponse = await sendNewPurchaseEmail();
        res.send(`<p>New Purchase Email Sent: ${result.sent}</p>`);
    });
    // Start the server and open a browser window
    const server = app.listen(PORT, async () => {
        console.log('[Gmail-Node-Mailer Test Server] - Server is listening on port:', PORT);
        try {
            await opener(`http://localhost:${PORT}`);

        } catch (error) {
            console.error('Failed to open browser:', error);
        }
    });

    // Handle SIGINT for graceful shutdown
    process.on('SIGINT', () => {
        console.log('Server is shutting down...');
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });
});
