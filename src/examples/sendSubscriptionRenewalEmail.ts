import fs from 'fs';
import util from 'util';

export async function sendSubscriptionRenewalEmail() {
    const recipientEmail = 'waleed@somnuslabs.com'; // Email recipient
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`;

    const subject = '🔄 Your Subscription Has Been Renewed!'; // Added emoji for more engaging subject
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #4CAF50; } // Green color for success
            p, footer { color: #333; } // Standard text color for readability
        </style>
    </head>
    <body>
        <h1>🎉 Subscription Renewal Confirmation</h1> <!-- Emoji added here for visual appeal -->
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

    // Handle PDF attachment in an email
    const pdfFilePath = './dummyFiles/SampleInvoice.pdf';
    const pdfData = await util.promisify(fs.readFile)(pdfFilePath);
    const pdfBase64 = pdfData.toString('base64');
    
    // Generate a text file content for usage stats
    const usageStatsContent = "Date: 2023-04-01 to 2023-04-30\nHours used: 120\nCost: $360";
    const usageStatsBase64 = Buffer.from(usageStatsContent).toString('base64');

    const attachments = [
        {
            filename: `Invoice-${formattedDate}.pdf`, // More specific filename with a date
            mimeType: 'application/pdf',
            content: pdfBase64,
        },
        {
            filename: `UsageStats-${formattedDate}.txt`, // Text file for usage stats
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
