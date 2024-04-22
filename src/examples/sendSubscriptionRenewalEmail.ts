/**
 * Example: Sending a subscription renewal email with the 'gmail-node-mailer' package.
 *
 * Sends a detailed HTML email to a customer about their successful subscription renewal. This function
 * attaches a PDF invoice and a text file with usage statistics, enhancing the customer's post-purchase
 * experience by providing comprehensive transaction details.
 *
 * This function demonstrates how to:
 *   - Construct HTML content for emails to convey renewal confirmation and gratitude effectively.
 *   - Attach multiple files (PDF invoice and text file for usage stats) with appropriate MIME types, showcasing the package's robust handling of mixed file formats.
 *   - Use modern JavaScript features, like async/await and promises, for asynchronous operations in sending emails.
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
 * This example underscores the 'gmail-node-mailer' package's utility in handling routine e-commerce communications for subscription services.
 *
 * @returns {Promise<ISendEmailResponse>} - Asynchronously sends an email and returns a promise that resolves with the outcome of the email sending operation, detailing success or failure information.
 */
import fs from 'fs';
import util from 'util';
import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer';

export async function sendSubscriptionRenewalEmail(): Promise<ISendEmailResponse> {
    const recipientEmail = 'waleed@glitchgaming.us';
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const subject = '🎥 StreamBox Subscription Renewed!';
    const message = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; color: #333; }
        .container { max-width: 600px; margin: auto; padding: 20px; background: #fff; border-radius: 8px; }
        h1 { color: #E50914; }
        p { margin: 10px 0; }
        footer { color: #888; font-size: 16px; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Welcome Back to StreamBox!</h1>
        <p>Hello,</p>
        <p>We're thrilled to let you know that your StreamBox subscription has been successfully renewed as of <strong>${formattedDate}</strong>.</p>
        <p>Continue enjoying unlimited movies and TV shows without interruption. Attached are your detailed invoice and usage statistics for your records.</p>
        <footer>Thanks for choosing StreamBox! 🎬<br>Contact us anytime at support@streambox.com</footer>
    </div>
</body>
</html>
    `;

    const pdfFilePath = './dummyFiles/StreamBox-Invoice.pdf';
    const pdfData = await util.promisify(fs.readFile)(pdfFilePath);
    const pdfBase64 = pdfData.toString('base64');

    const usageStatsContent = "Subscription Period: 2023-04-01 to 2023-04-30\nHours Streamed: 120\nSubscription Fee: $15.99";
    const usageStatsBase64 = Buffer.from(usageStatsContent).toString('base64');

    const attachments = [
        {
            filename: `StreamBox-Invoice-${formattedDate}.pdf`,
            mimeType: 'application/pdf',
            content: pdfBase64,
        },
        {
            filename: `StreamBox-Usage-${formattedDate}.txt`,
            mimeType: 'text/plain',
            content: usageStatsBase64,
        }
    ];

    return await global.gmailClient.sendEmail({
        recipientEmail,
        message,
        subject,
        attachments
    } as ISendEmailParams) as ISendEmailResponse;
}
