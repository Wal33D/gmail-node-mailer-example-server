/**
 * Sends an email notification about the server's start or shutdown status.
 * This function is triggered at the beginning or end of the server's lifecycle.
 * It sends an email to a predefined recipient with the current status and time.
 *
 * @param {string} status - Indicates whether the server is starting or shutting down.
 * @returns {Promise} - The result of the email sending operation.
 */

import fs from 'fs';
import util from 'util';

export async function sendServerStatusEmail(status: 'start' | 'shutdown') {
    const recipientEmail = 'waleed@somnuslabs.com'; // Define the recipient email here
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleString(); // Capture the current time
    const subject = `🖥️ Server ${status.charAt(0).toUpperCase() + status.slice(1)} Status`; // Adding emojis to the subject

    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            h1 { color: #007bff; } // Using a vibrant color for the header
            p { color: #555; } // Soft black for text for better readability
        </style>
    </head>
    <body>
        <h1>${status === 'start' ? '🚀 Server Starting' : '🌙 Server Shutting Down'}</h1>
        <p>The server is ${status === 'start' ? 'starting' : 'shutting down'} at ${formattedTime}.</p>
        <p>This email confirms the ${status === 'start' ? 'activation' : 'deactivation'} of the server processes.</p>
        <footer>
            <p>Contact support at <a href="mailto:support@somnuslabs.com">support@somnuslabs.com</a> if you have any concerns.</p>
        </footer>
    </body>
    </html>
    `;

    const serverHistoryFilePath = './dummyFiles/ServerHistory.csv'; 
    const serverHistoryEntry = `${formattedTime},${status === 'start' ? 'Server Start' : 'Server Shutdown'},Successful\n`;

    // Append to the file or create it if it doesn't exist
    try {
        if (!fs.existsSync(serverHistoryFilePath)) {
            fs.writeFileSync(serverHistoryFilePath, "Date,Event,Status\n"); // Create file with header if it doesn't exist
        }
        fs.appendFileSync(serverHistoryFilePath, serverHistoryEntry); // Append new entry to the file
    } catch (error) {
        console.error('Failed to write to server history file:', error);
    }

    // Read the complete server history file to attach it
    const serverHistoryData = await util.promisify(fs.readFile)(serverHistoryFilePath);
    const serverHistoryBase64 = serverHistoryData.toString('base64');

    const attachments = [
        {
            filename: 'ServerHistory.csv',
            mimeType: 'text/csv',
            content: serverHistoryBase64,
        }
    ];

    return await global.gmailClient.sendEmail({
        recipientEmail,
        message,
        subject,
        attachments
    });
}
