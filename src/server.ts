/**
 * Module: Test Server for Gmail-Node-Mailer
 *
 * This module initializes and runs an Express server to demonstrate the capabilities of the 'gmail-node-mailer' package by sending various types of emails.
 *
 * Features:
 *  - Initialize the Gmail client globally and set up middleware for handling JSON and URL-encoded data.
 *  - Serve static files located in the 'dummyFiles' directory.
 *  - Automatically send an email notification when the server starts or is shut down using Ctrl+C.
 *  - Demonstrate various email sending functionalities, including HTML emails, plain text emails, emails with attachments, and specific use-case emails like subscription renewals and new purchase confirmations.
 *
 * Global Variables:
 *  - `gmailClient`: Instance of the GmailMailer, initialized and used across the server for sending emails.
 *
 * Environment Variables:
 *  - `DEFAULT_URL`: Determines the port number on which the server listens. If not set, defaults to 6338.
 *
 * Endpoints:
 *  - `/files`: Serves static content from the 'dummyFiles' directory.
 *
 * Email Sending Examples Demonstrated:
 *  - sendServerStatusEmail: Sends a notification on server start or shutdown.
 *  - sendHtmlEmail: Sends a stylized HTML email for service notifications.
 *  - sendPlainTextEmail: Sends a simple text-based email.
 *  - sendHtmlEmailWithAttachment: Sends an HTML email with file attachments.
 *  - sendSubscriptionRenewalEmail: Sends a detailed HTML email for subscription renewal.
 *  - sendNewPurchaseEmail: Sends a confirmation email for new purchases.
 *
 * Usage:
 *  - The server can be started by running this file. Email sending functions are called within the server lifecycle hooks and upon specific endpoint hits.
 *
 * Shutdown Handling:
 *  - Graceful shutdown is implemented to send a shutdown email notification and properly close the server on receiving SIGINT.
 *
 * @returns {void} The server runs indefinitely until manually stopped, handling incoming requests and sending emails based on predefined triggers.
 */

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
