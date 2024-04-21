/**
 * Example: Sending a purchase confirmation email with the 'gmail-node-mailer' package.
 *
 * This function serves as a sample demonstration of how to use the 'gmail-node-mailer' package to send an HTML formatted email with multiple attachments in a Node.js environment. The example illustrates:
 *   - Automatic encoding of email subjects that contain special characters, such as emojis, demonstrating the package's ability to handle non-text elements within email headers.
 *   - Option to specify a sender email address different from the default, showcasing the package's flexibility in handling sender identities. If not provided, the email address used to initialize the class is used.
 *   - Attachment handling in emails, requiring manual specification of MIME types for files such as PDF invoices and EPUB eBooks, while the HTML content of the message is automatically handled for MIME compatibility.
 * This function sends an email providing immediate access to an eBook via a direct download link, along with a detailed invoice, enhancing the customer's purchase experience by offering transparency and immediate product access.
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
 * This example highlights the 'gmail-node-mailer' package's capabilities for managing advanced email features effortlessly.
 *
 * @returns {Promise<ISendEmailResponse>} - Asynchronously sends an email and returns a promise that resolves with the outcome of the email sending operation, detailing success or failure information.
 */

import fs from 'fs';
import util from 'util';
import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer/dist/types/types';

export async function sendNewPurchaseEmail(): Promise<ISendEmailResponse> {
    // Optional sender email address; default from initialization will be used if this is not specified.
    const senderEmail = 'no-reply@somnuslabs.com';
    // Define the recipient's email address to whom the email will be sent.
    const recipientEmail = 'waleed@glitchgaming.us';
    // Optionally define the subject with emojis or special characters; automatically encoded to Base64. Defaults to 'No Subject' if not provided.
    const subject = '📘 Your eBook Purchase Confirmation!';
    // Define Recipient name set to a generic 'Customer Name' for example purposes.
    const recipientName = 'Customer Name';
    // URL for downloading the eBook; defaults to a local URL if no environment variable is set.
    const url = process.env.DEFAULT_URL || `http://localhost:6338`;

    const message = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #007bff; color: white; padding: 10px; text-align: center; }
        .content { padding: 20px; text-align: left; line-height: 1.6; color: #333; }
        .content a { color: #007bff; text-decoration: none; }
        footer { font-size: smaller; text-align: center; padding-top: 10px; color: #787878; }
    </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌟 Welcome to Your New Adventure! 🌟</h1>
            </div>
            <div class="content">
                <p>Dear ${recipientName} 📖,</p>
                <p>🎉 We are delighted to confirm your purchase of the eBook <strong>"The Echoes of Time"</strong>. This thrilling adventure awaits your exploration. 🚀</p>
                <p>🔗 For immediate access to your eBook, please click <a href="${url}/files/SampleEBook.epub">here</a>. We have also attached your eBook file to this email for your convenience.</p>
                <p>🤝 Should you require any assistance or have any inquiries, feel free to contact our support team at <a href="mailto:${senderEmail}">${senderEmail}</a>.</p>
            </div>
            <div class="footer">
                Warm regards,<br>
                <strong>The Book Haven Team 📚</strong><br>
                📧 <a href="mailto:${senderEmail}">${senderEmail}</a>
            </div>
        </div>
    </body>
    </html>
    `;

    const ebookFilePath = './dummyFiles/SampleEBook.epub';
    const ebookData = await util.promisify(fs.readFile)(ebookFilePath);
    const ebookBase64 = ebookData.toString('base64');

    const receiptFilePath = './dummyFiles/SampleInvoice.pdf';
    const receiptData = await util.promisify(fs.readFile)(receiptFilePath);
    const receiptBase64 = receiptData.toString('base64');

    const attachments = [
        {
            filename: 'TheEchoesOfTime-eBook.epub',
            mimeType: 'application/epub+zip',
            content: ebookBase64,
        },
        {
            filename: 'PurchaseInvoice.pdf',
            mimeType: 'application/pdf',
            content: receiptBase64,
        }
    ];

    return await global.gmailClient.sendEmail({
        senderEmail,
        recipientEmail,
        message,
        subject,
        attachments
    } as ISendEmailParams) as ISendEmailResponse;
}
