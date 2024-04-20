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
 * This server is particularly useful for developers looking to integrate email functionalities in their applications using 'gmail-node-mailer', providing practical, executable examples.
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

import { ISendEmailResponse } from 'gmail-node-mailer/dist/types';
import { initializeEmailClient } from './init/initializeEmailClient';
import {*}  from './examples';

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

// Menu for triggering email functions
app.get('/', (req, res) => {
    res.send(`
        <h1>Gmail-Node-Mailer Test Server</h1>
        <ul>
            <li><a href="/start-server" target="_blank">Start Server</a></li>
            <li><a href="/stop-server" target="_blank">Stop Server</a></li>
            <li><a href="/send-html-email" target="_blank">Send HTML Email</a></li>
            <li><a href="/send-plain-text-email" target="_blank">Send Plain Text Email</a></li>
            <li><a href="/send-html-email-attachment" target="_blank">Send HTML Email with Attachment</a></li>
            <li><a href="/send-subscription-renewal" target="_blank">Send Subscription Renewal Email</a></li>
            <li><a href="/send-new-purchase" target="_blank">Send New Purchase Email</a></li>
        </ul>
    `);
});

// Initialize the Gmail client
initializeEmailClient().then(emailClientResult => {
    global.gmailClient = emailClientResult.gmailClient;

    // Define endpoints for each email function
    app.get('/start-server', async (req, res) => {
        const serverStartResult: ISendEmailResponse = await examples.sendServerStatusEmail('start');
        console.log('Server Start Email Send Result:', serverStartResult.sent);
        res.send('<p>Server started. Email sent.</p>');
    });

    app.get('/stop-server', async (req, res) => {
        const shutdownEmailResult: ISendEmailResponse = await examples.sendServerStatusEmail('shutdown');
        console.log('Server Shutdown Email Send Result:', shutdownEmailResult.sent);
        res.send('<p>Server stopped. Email sent.</p>');
    });

    app.get('/send-html-email', async (req, res) => {
        const result: ISendEmailResponse = await examples.sendHtmlEmail();
        res.send(`<p>HTML Email Sent: ${result.sent}</p>`);
    });

    app.get('/send-plain-text-email', async (req, res) => {
        const result: ISendEmailResponse = await examples.sendPlainTextEmail();
        res.send(`<p>Plain Text Email Sent: ${result.sent}</p>`);
    });

    app.get('/send-html-email-attachment', async (req, res) => {
        const result: ISendEmailResponse = await examples.sendHtmlEmailWithAttachment();
        res.send(`<p>HTML Email with Attachment Sent: ${result.sent}</p>`);
    });

    app.get('/send-subscription-renewal', async (req, res) => {
        const result: ISendEmailResponse = await examples.sendSubscriptionRenewalEmail();
        res.send(`<p>Subscription Renewal Email Sent: ${result.sent}</p>`);
    });

    app.get('/send-new-purchase', async (req, res) => {
        const result: ISendEmailResponse = await examples.sendNewPurchaseEmail();
        res.send(`<p>New Purchase Email Sent: ${result.sent}</p>`);
    });

    // Start the server and open a browser window
    const server = app.listen(PORT, async () => {
        const open = (await import('open')).default; // Ensure this import works correctly
        await open(`http://localhost:${PORT}`);
    });

    // Handle SIGINT for graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Server is shutting down...');
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });
});
