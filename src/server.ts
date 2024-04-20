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
import * as examples from './examples';

declare global {
    var gmailClient: any;
}

const PORT = process.env.DEFAULT_URL
    ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338
    : 6338;

(async () => {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/files', express.static('dummyFiles'));

    const emailClientResult = await initializeEmailClient();
    global.gmailClient = emailClientResult.gmailClient;

    app.get('/', (req, res) => {
        res.send(`
            <h1>Server Control Panel</h1>
            <form action="/control" method="post">
                <input type="submit" name="action" value="Start Server">
                <input type="submit" name="action" value="Stop Server">
            </form>
        `);
    });

    app.post('/control', async (req, res) => {
        const action = req.body.action;
        if (action === 'Start Server') {
            const serverStartResult: ISendEmailResponse = await examples.sendServerStatusEmail('start');
            console.log('Server Start Email Send Result:', serverStartResult.sent);
            res.send("<p>Server started. Email notification sent.</p>");
        } else if (action === 'Stop Server') {
            const shutdownEmailResult: ISendEmailResponse = await examples.sendServerStatusEmail('shutdown');
            console.log('Server Shutdown Email Send Result:', shutdownEmailResult.sent);
            process.exit(0);
        } else {
            res.send("<p>Invalid action.</p>");
        }
    });

    const server = app.listen(PORT, () => {
        console.log('[Gmail-Node-Mailer Test Server] - Initialization Summary:');
        console.log('Server is listening on port:', PORT);
    });

    process.on('SIGINT', () => {
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });
})();
