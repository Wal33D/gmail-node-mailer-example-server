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
import * as examples from './examples'; // Importing example functions to demonstrate email capabilities

declare global {
    var gmailClient: any; // Global declaration to share the Gmail client across the demonstration modules
}

const PORT = process.env.DEFAULT_URL
    ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338
    : 6338;

(async () => {
    const app = express();

    // Initialize the Gmail client as a demonstration of setting up the 'gmail-node-mailer' package for email operations
    const emailClientResult = await initializeEmailClient();
    global.gmailClient = emailClientResult.gmailClient;

    // Middleware setup for handling form submissions and JSON data as part of the email sending demonstrations
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Serve static files as part of demonstrating attachment handling in email sending
    app.use('/files', express.static('dummyFiles'));

    // Demonstration of sending a notification email upon server start
    const serverStartResult: ISendEmailResponse = await examples.sendServerStatusEmail('start');
    console.log('Server Start Email Send Result:', serverStartResult.sent);

    // Logs server startup for demonstration purposes
    const server = app.listen(PORT, () => {
        console.log('[Gmail-Node-Mailer Test Server] - Initialization Summary:');
        console.log('Server is listening on port:', PORT);
    });

    // Demonstrates graceful shutdown and notification via email on SIGINT
    process.on('SIGINT', async () => {
        const shutdownEmailResult: ISendEmailResponse = await examples.sendServerStatusEmail('shutdown');
        console.log('Server Shutdown Email Send Result:', shutdownEmailResult.sent);

        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });

    // Demonstrates sending various types of emails using the 'gmail-node-mailer' package
    const sendHTMLEmailResult:ISendEmailResponse = await examples.sendHtmlEmail();
    console.log('Service Notification Email Send Result:', sendHTMLEmailResult);


})();
