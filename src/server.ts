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

import opener from 'opener';
import express from 'express';

import { ISendEmailResponse } from 'gmail-node-mailer/dist/types';

import { sendHtmlEmail } from './examples/sendHtmlEmail';
import { sendPlainTextEmail } from './examples/sendPlainTextEmail';
import { sendNewPurchaseEmail } from './examples/sendNewPurchaseEmail';
import { sendServerStatusEmail } from './examples/sendServerStatusEmail';
import { initializeEmailClient } from './init/initializeEmailClient';
import { sendHtmlEmailWithAttachment } from './examples/sendHtmlEmailWithAttachment';
import { sendSubscriptionRenewalEmail } from './examples/sendSubscriptionRenewalEmail';

declare global {
    var gmailClient: any; // Declare the global variable for Gmail client
}

const PORT = process.env.DEFAULT_URL ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338 : 6338;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/files', express.static('dummyFiles'));

function setupEmailEndpoint(path:any, emailFunction:any) {
    app.get(path, async (req, res) => {
        const result: ISendEmailResponse = await emailFunction();
        res.send(`${path} Email Sent: ${result.sent}`);
    });
}
// Menu for triggering email functions and simulating server status notifications
app.get('/', (req, res) => {
    res.send(getMenuHtml());
});

// Initialize the Gmail client
initializeEmailClient().then(emailClientResult => {
    global.gmailClient = emailClientResult.gmailClient;

    // Define endpoints for each email function
    setupEmailEndpoint('/simulate-server-status', () => sendServerStatusEmail('start'));
    setupEmailEndpoint('/send-html-email', sendHtmlEmail);
    setupEmailEndpoint('/send-plain-text-email', sendPlainTextEmail);
    setupEmailEndpoint('/send-html-email-attachment', sendHtmlEmailWithAttachment);
    setupEmailEndpoint('/send-subscription-renewal', sendSubscriptionRenewalEmail);
    setupEmailEndpoint('/send-new-purchase', sendNewPurchaseEmail);

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

function getMenuHtml(responseMessage = '') {
    return `
        <html>
            <head>
                <title>Gmail-Node-Mailer Test Server</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    ul { list-style: none; padding: 0; }
                    li { margin-bottom: 10px; }
                    button { padding: 10px 20px; cursor: pointer; }
                </style>
            </head>
            <body>
                <h1>Gmail-Node-Mailer Test Server</h1>
                <p>${responseMessage}</p>
                <ul>
                    <li><button onclick="makeRequest('/simulate-server-status')">Simulate Server Status Emails</button></li>
                    <li><button onclick="makeRequest('/send-html-email')">Send HTML Email</button></li>
                    <li><button onclick="makeRequest('/send-plain-text-email')">Send Plain Text Email</button></li>
                    <li><button onclick="makeRequest('/send-html-email-attachment')">Send HTML Email with Attachment</button></li>
                    <li><button onclick="makeRequest('/send-subscription-renewal')">Send Subscription Renewal Email</button></li>
                    <li><button onclick="makeRequest('/send-new-purchase')">Send New Purchase Email</button></li>
                </ul>
                <script>
                    function makeRequest(url) {
                        fetch(url)
                            .then(response => response.text())
                            .then(html => {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                document.querySelector('p').innerText = doc.querySelector('p').innerText;
                            })
                            .catch(err => console.error('Request failed', err));
                    }
                </script>
            </body>
        </html>
    `;
}
