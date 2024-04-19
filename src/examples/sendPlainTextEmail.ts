/**
 * Sends a plain text email.
 * This function is designed to demonstrate the sending of a simple text email without any HTML formatting.
 * It is ideal for sending straightforward, no-frills messages.
 *
 * @returns {Promise} - The result of the email sending operation.
 */

export async function sendPlainTextEmail() {
    const recipientEmail = 'waleed@somnuslabs.com'; 
    const subject = 'Plain Text Email Demo: Welcome Aboard!';
    const message = `
    Hi there! 

    This is a sample plain text email to demonstrate how you can send simple text-based emails using our service. Your subscription is now active, and we're excited to have you onboard!
    Feel free to customize this email content to better fit your needs. 
    Welcome to the community!

    Best,
    The Team
    `;

    return await global.gmailClient.sendEmail({
        recipientEmail,
        message,
        subject,
    });
}
