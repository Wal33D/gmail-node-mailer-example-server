import fs from 'fs';
import util from 'util';

export async function sendNewPurchaseEmail() {
    const senderEmail = 'no-reply@somnuslabs.com';
    const recipientEmail = 'waleed@somnuslabs.com';
    const subject = '📘 Your eBook Purchase Confirmation!';

    const recipientName = recipientEmail.split('@')[0].charAt(0).toUpperCase() + recipientEmail.split('@')[0].slice(1);

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
                <p>🔗 For immediate access to your eBook, please click <a href="${process.env.DEFAULT_URL}/files/SampleEBook.epub">here</a>. We have also attached your eBook file to this email for your convenience.</p>
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
    });
}
