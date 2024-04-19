export async function sendHtmlEmailWithAttachment() {
    const recipientEmail = 'waleed@somnuslabs.com';
    const subject = '🎉 Welcome to StreamBox!';
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
        <p>Your subscription to StreamBox is now active. You have unlimited access to a vast library of movies and series. Enjoy! 🍿🎬</p>
        <div class="footer">
            <p>Contact us at <a href="mailto:no-reply@StreamBox.com" style="color: white;">no-reply@StreamBox.com</a></p>
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
    });
}
