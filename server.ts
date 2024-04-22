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
import router from './src/routes'; // Import the router from the routes file
import express from 'express';
import serveIndex from 'serve-index';

import { initializeEmailClient } from './src/init/initializeEmailClient';

declare global {
    var gmailClient: any;
}

const PORT = process.env.DEFAULT_URL ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338 : 6338;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static and index serving middleware
app.use('/files', express.static('dummyFiles'), serveIndex('dummyFiles', { 'icons': true }));
app.use(express.static('public'));

// Using the imported router for all email functionality and other endpoints
app.use(router);

// Initialize email client and setup global access
initializeEmailClient().then((emailClientResult: { gmailClient: any; }) => {
    global.gmailClient = emailClientResult.gmailClient;
});

// Start the server and open a browser window
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    opener(`http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
});
