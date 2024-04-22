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
    const senderName = 'StreamBox Subscription';

    const message = `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #141414; color: #fff; }
    .container { max-width: 800px; margin: 20px auto; background-color: #000; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); color: #fff; }
    .header { background-color: #E50914; padding: 16px 20px; font-size: 24px; font-weight: bold; text-align: center; }
    .content { padding: 20px; text-align: center; background-color: #fff; color: #000; } /* Updated background and text color */
    h1 { margin: 0; color: #000; } /* Ensure header colors are black for visibility */
    p { margin-bottom: 10px; color: #000; } /* Ensure paragraph text is black */
    .footer { background-color: #181818; font-size: 16px; text-align: center; padding: 20px; }
    .footer a, .footer a:visited { color: #FFA500!important; text-decoration: none; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">🌟 StreamBox Subscription Renewal</div>
        <div class="content">
            <h1>Welcome Back!</h1>
            <p>Hello,</p>
            <p>We're thrilled to let you know that your StreamBox subscription has been successfully renewed as of <strong>${formattedDate}</strong>.</p>
            <p>Continue enjoying unlimited movies and TV shows without interruption. Attached are your detailed invoice and usage statistics for your records.</p>
        </div>
        <div class="footer">
            <p>Thanks for choosing StreamBox! 🎬<br>Contact us anytime at <a href="mailto:support@streambox.com">support@streambox.com</a></p>
        </div>
    </div>
</body>
</html>
    `;

    const pdfFilePath = './dummyFiles/SampleInvoice.pdf';
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
        senderName,
        message,
        subject,
        attachments
    } as ISendEmailParams) as ISendEmailResponse;
}
