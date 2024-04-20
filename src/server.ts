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

import { sendHtmlEmail } from './examples/sendHtmlEmail';
import { sendPlainTextEmail } from './examples/sendPlainTextEmail';
import { sendNewPurchaseEmail } from './examples/sendNewPurchaseEmail';
import { sendServerStatusEmail } from './examples/sendServerStatusEmail';
import { initializeEmailClient } from './init/initializeEmailClient';
import { sendHtmlEmailWithAttachment } from './examples/sendHtmlEmailWithAttachment';
import { sendSubscriptionRenewalEmail } from './examples/sendSubscriptionRenewalEmail';

declare global {
    var gmailClient: any;
}

const PORT = process.env.DEFAULT_URL ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338 : 6338;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/files', express.static('dummyFiles'));

function setupEmailEndpoint(path: any, emailFunction: any) {
    app.get(path, async (req, res) => {
        const result: ISendEmailResponse = await emailFunction();
        res.json({
            path: path.replace('/', '').replace(/-/g, ' ').toUpperCase(),
            sent: result.sent,
            status: result.status || 'N/A',
            statusText: result.statusText || 'No status text',
            message: result.message || 'No message provided'
        });
    });
}

app.get('/', (req, res) => {
    res.send(getMenuHtml());
});

initializeEmailClient().then(emailClientResult => {
    global.gmailClient = emailClientResult.gmailClient;

    setupEmailEndpoint('/simulate-server-status', () => sendServerStatusEmail('start'));
    setupEmailEndpoint('/send-html-email', sendHtmlEmail);
    setupEmailEndpoint('/send-plain-text-email', sendPlainTextEmail);
    setupEmailEndpoint('/send-html-email-attachment', sendHtmlEmailWithAttachment);
    setupEmailEndpoint('/send-subscription-renewal', sendSubscriptionRenewalEmail);
    setupEmailEndpoint('/send-new-purchase', sendNewPurchaseEmail);

    const server = app.listen(PORT, async () => {
        console.log(`[Gmail-Node-Mailer Test Server] - Server is listening on port: ${PORT}`);
        try {
            await opener(`http://localhost:${PORT}`);
        } catch (error) {
            console.error('Failed to open browser:', error);
        }
    });

    process.on('SIGINT', () => {
        console.log('Server is shutting down...');
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });
});
function getMenuHtml() {
    return `
        <html>
            <head>
                <title>Gmail-Node-Mailer Test Server</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
                <style>
                    body {
                        font-family: 'Lucida Console', Monaco, monospace;
                        background-color: #333;
                        color: #8CFF98;
                    }
                    h1 {
                        border-bottom: 2px solid #8CFF98;
                    }
                    #menu {
                        padding-right: 20px;
                    }
                    #menu button {
                        margin-bottom: 10px;
                        width: 100%;
                    }
                    #log {
                        background: #000;
                        border: 1px solid #666;
                    }
                    #log table {
                        margin-bottom: 0;
                    }
                    th, td {
                        border: 1px solid #666;
                        text-align: left;
                        overflow: hidden;
                    }
                    th {
                        background-color: #555;
                    }
                    tr:nth-child(odd) {
                        background-color: #222;
                    }
                    #statusMessage {
                        padding: 5px;
                        background-color: #222;
                        border: 1px solid #666;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container-fluid">
                    <h1>Gmail-Node-Mailer Test Server</h1>
                    <div id="statusMessage">Ready to send emails...</div>
                    <div class="row">
                        <div id="menu" class="col-md-4">
                            <button onclick="makeRequest('/simulate-server-status')" class="btn btn-success">Simulate Server Status Emails</button>
                            <button onclick="makeRequest('/send-html-email')" class="btn btn-success">Send HTML Email</button>
                            <button onclick="makeRequest('/send-plain-text-email')" class="btn btn-success">Send Plain Text Email</button>
                            <button onclick="makeRequest('/send-html-email-attachment')" class="btn btn-success">Send HTML Email with Attachment</button>
                            <button onclick="makeRequest('/send-subscription-renewal')" class="btn btn-success">Send Subscription Renewal Email</button>
                            <button onclick="makeRequest('/send-new-purchase')" class="btn btn-success">Send New Purchase Email</button>
                        </div>
                        <div class="col-md-8">
                            <div id="log" class="overflow-auto">
                                <table class="table table-dark table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Action</th>
                                            <th>Sent</th>
                                            <th>Status</th>
                                            <th>Status Text</th>
                                            <th>Message</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
                <script>
                    function makeRequest(url) {
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                const log = document.querySelector('#log tbody');
                                const row = document.createElement('tr');
                                row.innerHTML = '<td>' + data.path + '</td>' +
                                                '<td>' + data.sent + '</td>' +
                                                '<td>' + (data.status || 'N/A') + '</td>' +
                                                '<td>' + (data.statusText || 'No status text') + '</td>' +
                                                '<td>' + (data.message || 'No message provided') + '</td>';
                                log.appendChild(row);
                                const statusMessage = document.getElementById('statusMessage');
                                statusMessage.textContent = 'Latest activity updated below:';
                            })
                            .catch(err => {
                                console.error('Request failed', err);
                                const statusMessage = document.getElementById('statusMessage');
                                statusMessage.textContent = 'Failed to update due to an error.';
                            });
                    }
                </script>
            </body>
        </html>
    `;
}
