/**
 * Example: Sending a status email from your server with the 'gmail-node-mailer' package.
 *
 * Sends an email notification about the server's start or shutdown status.
 * This function is triggered at the beginning or end of the server's lifecycle.
 * It sends an email to a predefined recipient with the current status and time.
 *
 * This function demonstrates how to use the 'gmail-node-mailer' package to:
 *   - Send HTML emails with dynamic content based on the server's operational status.
 *   - Automatically manage MIME types for email attachments, showcasing the package’s handling of non-textual file formats.
 *
 * Interface Structures:
 *   - `ISendEmailParams`:
 *     {
 *       recipientEmail: string,
 *       senderEmail?: string,  // Optional. Defaults to the email address initialized in the GmailMailer class if not provided.
 *       subject?: string,  // Optional. Defaults to 'No Subject' if not provided.
 *       message: string,
 *       attachments?: IAttachment[]
 *     }
 *   - `ISendEmailResponse`:
 *     {
 *       sent: boolean,
 *       status: number | null,
 *       statusText: string | null,
 *       responseUrl: string | null,
 *       message: string,
 *       gmailResponse: any | null
 *     }
 *
 * This usage example highlights how the 'gmail-node-mailer' package can enhance server management by providing timely notifications about significant lifecycle events.
 *
 * @param {string} status - Indicates whether the server is starting or shutting down.
 * @returns {Promise} - The result of the email sending operation.
 */

import fs from 'fs';
import util from 'util';
import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer/dist/types';

export async function sendServerStatusEmail(status: 'start' | 'shutdown'): Promise<ISendEmailResponse> {
    const recipientEmail = 'admin@glitchgaming.us'; // Email address to which the notification will be sent
    const currentTime = new Date(); // Current time at the moment of function execution
    const formattedTime = currentTime.toLocaleString(); // Current time formatted for readability

    // Construct the subject line with an emoji for visual emphasis
    const subject = `🖥️ Server ${status.charAt(0).toUpperCase() + status.slice(1)} Status`;

    // HTML content of the email
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            h1 { color: #007bff; } // Bright blue for headers
            p { color: #555; } // Dark gray for body text
        </style>
    </head>
    <body>
        <h1>${status === 'start' ? '🚀 Server Starting' : '🌙 Server Shutting Down'}</h1>
        <p>The server is ${status === 'start' ? 'starting' : 'shutting down'} at ${formattedTime}.</p>
        <p>This email confirms the ${status === 'start' ? 'activation' : 'deactivation'} of server processes.</p>
        <footer>
            <p>Contact support at <a href="mailto:support@somnuslabs.com">support@somnuslabs.com</a> if you have any concerns.</p>
        </footer>
    </body>
    </html>
    `;

    const serverHistoryFilePath = './dummyFiles/ServerHistory.csv';
    const serverHistoryEntry = `${formattedTime},${status === 'start' ? 'Server Start' : 'Server Shutdown'},Successful\n`;

    // Append a new entry to the server history file, or create it if it doesn't exist
    try {
        if (!fs.existsSync(serverHistoryFilePath)) {
            fs.writeFileSync(serverHistoryFilePath, "Date,Event,Status\n"); // Create the file with a header if it doesn't exist
        }
        fs.appendFileSync(serverHistoryFilePath, serverHistoryEntry); // Append the current event to the file
    } catch (error) {
        console.error('Failed to write to server history file:', error);
    }

    // Read the complete server history file to attach it to the email
    const serverHistoryData = await util.promisify(fs.readFile)(serverHistoryFilePath);
    const serverHistoryBase64 = serverHistoryData.toString('base64');

    const attachments = [{
        filename: 'ServerHistory.csv',
        mimeType: 'text/csv',
        content: serverHistoryBase64,
    }];

    // Send the email with the attached server history
    return await global.gmailClient.sendEmail({
        recipientEmail,
        message,
        subject,
        attachments
    } as ISendEmailParams) as ISendEmailResponse;
}
