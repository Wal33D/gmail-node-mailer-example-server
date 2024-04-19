/**
 * Sends an email regarding the renewal of a subscription.
 * This function constructs an HTML email with details about the subscription renewal and attaches a PDF invoice.
 * It showcases handling of typical e-commerce communication, specifically for subscription-based services.
 *
 * @returns {Promise} - The result of the email sending operation.
 */

import fs from 'fs';
import util from 'util';

export async function sendSubscriptionRenewalEmail() {
    const recipientEmail = 'waleed@somnuslabs.com';
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`;

    const subject = '🔄 Your Subscription Has Been Renewed!';
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
    });
}
