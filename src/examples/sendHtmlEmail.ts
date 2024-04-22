/**
 * Example: Sending a service activation notification email using the 'gmail-node-mailer' package.
 *
 * This function demonstrates how to send HTML formatted emails with predefined styles to notify users about service activation. 
 *
 * The function sends an email with a subject celebrating the user's service activation and includes basic contact information in the footer. It leverages the 'gmail-node-mailer' package to:
 *   - Send HTML emails that incorporate style elements directly within the email body.
 *   - Utilize special characters like emojis in the email subject line, demonstrating the package's handling of UTF-8 characters.
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
 * This example illustrates the simplicity and effectiveness of communicating essential service information via the 'gmail-node-mailer' package.
 *
 * @returns {Promise<ISendEmailResponse>} - Asynchronously sends an email and returns a promise that resolves with the outcome of the email sending operation, detailing success or failure information.
 */

import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer';

export async function sendHtmlEmail(): Promise<ISendEmailResponse> {
    const recipientEmail = 'waleed@glitchgaming.us';
    const subject = '🎉 HTML Email Demo with gmail-node-mailer!';
    const senderName = 'gmail-node-mailer';

    const message = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body, html { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
        .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; text-align: left; font-size: 16px; color: #333; }
        .code { background-color: #e8f0fe; padding: 15px; font-family: monospace; color: #0056b3; border-left: 5px solid #0056b3; margin-top: 20px; }
        .footer { background-color: #003366; color: white; padding: 20px; text-align: center; }
        a { color: #FFD700; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
        @media (max-width: 600px) {
            .header, .content, .footer { padding: 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to the gmail-node-mailer Demo!</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>This email provides a detailed look at how to send HTML formatted messages using the gmail-node-mailer package. Below is an explanation of the parameters you can use:</p>
            <pre class="code">
ISendEmailParams {
    recipientEmail: string;  // The email address of the recipient.
    senderEmail?: string;    // Optional. The email address of the sender.
    senderName?: string;     // Optional. The name of the sender.
    subject?: string;        // Optional. The subject line of the email.
    message: string;         // The HTML content of the email.
    attachments?: IAttachment[]; // Optional. Array of attachments.
}

IAttachment {
    filename: string;    // Name of the file to be attached.
    mimeType: string;    // MIME type of the file.
    content: string;     // Base64 encoded content of the file.
}

ISendEmailResponse {
    sent: boolean;               // Whether the email was successfully sent.
    status: number | null;       // HTTP status code of the send email attempt.
    statusText: string | null;   // Status text corresponding to the status code.
    responseUrl: string | null;  // URL of the API endpoint used to send the email.
    message: string;             // Success or error message.
    gmailResponse: any | null;   // The full response from the Gmail API.
}
            </pre>
            <p>Your account is now fully activated, and you can begin exploring all our features.</p>
        </div>
        <div class="footer">
            <p>Need assistance? Contact us at <a href="mailto:support@gmail-node-mailer-demo.com">support@gmail-node-mailer-demo.com</a></p>
        </div>
    </div>
</body>
</html>
    `;
    return await global.gmailClient.sendEmail({
        recipientEmail,
        senderName,
        message,
        subject,
    } as ISendEmailParams) as ISendEmailResponse;
}
