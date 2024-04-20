/**
 * Example: Sending an HTML email with a text file attachment using the 'gmail-node-mailer' package.
 *
 * This function is designed to send a welcome email to new subscribers of the StreamBox service. It showcases how to send emails with HTML content and a text file attachment. The HTML format enhances the visual appeal, while the attached text file provides additional information about the subscription benefits.
 *
 * The function demonstrates the 'gmail-node-mailer' capabilities, including:
 *   - Creating HTML content for the body of the email, with styled components like headers and footers.
 *   - Encoding text content into a base64 format and attaching it as a .txt file, demonstrating the package's handling of textual attachments.
 *   - Sending emails with emoticons in the subject line, illustrating the package's support for unicode characters.
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
 * This function provides a practical example of delivering customized and interactive communication to enhance user engagement and satisfaction right from the start of the subscription.
 *
 * @returns {Promise<ISendEmailResponse>} - Asynchronously sends an email and returns a promise that resolves with the outcome of the email sending operation, detailing success or failure information.
 */

import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer/dist/types';

export async function sendHtmlEmailWithAttachment(): Promise<ISendEmailResponse> {
    // Define the recipient's email address to whom the welcome email will be sent.
    const recipientEmail = 'waleed@somnuslabs.com';
    // Subject of the email, including an emoji; automatically encoded to Base64.
    const subject = '🎉 Welcome to StreamBox!';
    // Define the HTML message to be sent, which includes formatting specific to HTML content.
    const message = `;
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background-color: #007bff; color: white; padding: 10px; text-align: center; }
            .content { padding: 20px; text-align: left; line-height: 1.6; color: #333; }
            footer { font-size: smaller; text-align: center; padding-top: 10px; color: #787878; }
            footer a { color: #007bff; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Service Notification</h1>
            </div>
            <div class="content">
                <p>Your subscription to StreamBox is now active. You have unlimited access to a vast library of movies and series. Enjoy! 🍿🎬</p>
            </div>
            <footer>
                <p>Contact us at <a href="mailto:no-reply@StreamBox.com">no-reply@StreamBox.com</a></p>
            </footer>
        </div>
    </body>
    </html>    
    `;

    // Handle text file creation and encoding
    const textContent = "Your subscription to StreamBox is now active. You have unlimited access to a vast library of movies and series. Enjoy! 🍿🎬";
    const textBase64 = Buffer.from(textContent).toString('base64');
    const attachment = {
        filename: 'WelcomeInfo.txt',
        mimeType: 'text/plain',
        content: textBase64,
    };

    return await global.gmailClient.sendEmail({
        recipientEmail,
        message,
        subject,
        attachments: [attachment]
    } as ISendEmailParams) as ISendEmailResponse;
}
