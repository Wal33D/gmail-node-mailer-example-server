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
   // Define the recipient's email address to whom the renewal confirmation email will be sent.
    const recipientEmail = 'waleed@glitchgaming.us';
    // Current date, used to stamp the time of subscription renewal.
    const currentDate = new Date();
    // Formatted date string in 'YYYY-MM-DD' format, used in the email to display the renewal date.
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`;
    // Subject of the email, which includes an emoji; the package automatically encodes it to Base64.
    const subject = '🔄 Your Subscription Has Been Renewed!';
        // Define the HTML message to be sent, structured for automatic encoding by the gmail-node-mailer package. 
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #4CAF50; }
            p, footer { color: #333; }
        </style>
    </head>
    <body>
        <h1>🎉 Subscription Renewal Confirmation</h1>
        <p>Dear Customer,</p>
        <p>Your subscription has been <strong>successfully renewed</strong>. Thank you for staying with us! 🌟</p>
        <p>Please find attached your invoice and usage stats for this transaction.</p>
        <footer>
            Regards,<br>
            The Team
        </footer>
    </body>
    </html>
    `;

    const pdfFilePath = './dummyFiles/SampleInvoice.pdf';
    const pdfData = await util.promisify(fs.readFile)(pdfFilePath);
    const pdfBase64 = pdfData.toString('base64');
    
    const usageStatsContent = "Date: 2023-04-01 to 2023-04-30\nHours used: 120\nCost: $360";
    const usageStatsBase64 = Buffer.from(usageStatsContent).toString('base64');

    const attachments = [
        {
            filename: `Invoice-${formattedDate}.pdf`,
            mimeType: 'application/pdf',
            content: pdfBase64,
        },
        {
            filename: `UsageStats-${formattedDate}.txt`,
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
