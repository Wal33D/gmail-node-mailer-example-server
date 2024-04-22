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
 *       senderName?: string;// Optional. Defaults to the string after the @ symbol in the senderEmail if not provided.
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
import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer';

export async function sendServerStatusEmail(status: 'start' | 'shutdown'): Promise<ISendEmailResponse> {
    // Define the recipient's email address to whom the server status will be sent.
    const recipientEmail = 'waleed@glitchgaming.us';
    // Capture and format the current date and time for a clear, human-readable timestamp in the email body, a superficial detail not demonstrating the gmail-node-mailer package.
    const formattedTime = new Date().toLocaleString();
    // Optionally define the subject with emojis or special characters; automatically encoded to Base64. Defaults to 'No Subject' if not provided.
    const subject = `🖥️ Somnus Labs - Server ${status.charAt(0).toUpperCase() + status.slice(1)} Status`;
    const senderName = 'Somnus Labs Support';
    // Define the HTML message to be sent, structured for automatic encoding by the gmail-node-mailer package. 
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Basic reset and fonts setup */
            body, html { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; }
            /* Container for the email content */
            .container { background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            /* Styling for the header */
            .header { background-color: #E0EFFF; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            h1 { color: #0A3E5D; font-size: 28px; margin: 0; }
            /* Main content styles */
            .status-details { background-color: #F8F8F8; padding: 20px; border-radius: 5px; margin-top: 20px; color: #333; }
            p { font-size: 16px; line-height: 1.5; margin: 10px 0; }
            .status-update { font-weight: 600; } /* Bolder font for important updates */
            /* Footer styles */
            .footer { font-size: 16px; text-align: center; padding: 20px; border-top: 1px solid #ccc; margin-top: 20px; }
            a, .support-link { color: #0A3E5D; text-decoration: none; font-weight: 600; }
            .footer a { color: #007bff; text-decoration: underline; }
            /* Icon styles for fun and clear visual cues */
            .status-icon { font-size: 48px; vertical-align: middle; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><span class="status-icon">${status === 'start' ? '🚀' : '🌙'}</span> Server ${status === 'start' ? 'Starting' : 'Shutting Down'}</h1>
            </div>
            <div class="status-details">
                <p>The server is ${status === 'start' ? 'currently starting up' : 'currently shutting down'} as of ${formattedTime}.</p>
                <p class="status-update">This email confirms the ${status === 'start' ? 'activation' : 'deactivation'} of the server processes. For more details, please check the server dashboard or contact support if you notice any issues.</p>
            </div>
            <footer>
                <p>Need help? <a href="mailto:support@somnuslabs.com" class="support-link">Contact support</a> if you have any concerns or require assistance.</p>
            </footer>
        </div>
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
        senderName,
        message,
        subject,
        attachments
    } as ISendEmailParams) as ISendEmailResponse;
}
