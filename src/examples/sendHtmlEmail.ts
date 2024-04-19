/**
 * Sends a general HTML formatted email to notify the user about service activation.
 * This function is a demonstration of sending HTML emails using predefined styles and content.
 *
 * @returns {Promise} - The result of the email sending operation.
 */

export async function sendHtmlEmail() {
    const recipientEmail = 'waleed@somnuslabs.com';
    const subject = '🎉 Welcome to Our Service!';
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
    });
}
