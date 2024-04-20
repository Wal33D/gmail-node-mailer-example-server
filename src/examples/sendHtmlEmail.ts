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

import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer/dist/types';

export async function sendHtmlEmail(): Promise<ISendEmailResponse> {
    // Define the recipient's email address to whom the welcome email will be sent.
    const recipientEmail = 'waleed@glitchgaming.us';
    // Subject of the email, which includes an emoji; the package automatically encodes it to Base64.
    const subject = '🎉 Welcome to Our Service!';
    // Define the HTML message to be sent, structured for automatic encoding by the gmail-node-mailer package.
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f0f0f0; }
            .header { background-color: #007bff; color: white; padding: 10px; text-align: center; }
            .footer { background-color: #007bff; color: white; padding: 10px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Service Notification</h1>
        </div>
        <p>Thank you for using our service. Your account is fully activated!</p>
        <div class="footer">
            <p>Contact us at <a href="mailto:no-reply@somnuslabs.com" style="color: white;">no-reply@somnuslabs.com</a></p>
        </div>
    </body>
    </html>
    `;

    return await global.gmailClient.sendEmail({
        recipientEmail,
        message,
        subject,
    } as ISendEmailParams) as ISendEmailResponse;
}
