/**
 * Sends a plain text email.
 * This function demonstrates sending a simple text email without HTML formatting.
 * It is ideal for straightforward, no-frills messages.
 *
 * @returns {Promise} - The result of the email sending operation, whether it was successful or encountered an error.
 */
export async function sendPlainTextEmail() {
    // Define the recipient's email address
    const recipientEmail = 'customer@glitchgaming.us'; 
    // Define the subject of the email
    const subject = 'Plain Text Email Demo: Welcome Aboard!';
    // Define the plain text message to be sent
    const message = `
    Hi there!

    This is a sample plain text email to demonstrate how you can send simple text-based emails using our service. Your subscription is now active, and we're excited to have you onboard!
    Feel free to customize this email content to better fit your needs. 
    Welcome to the community!

    Best,
    The Team
    `;

    // Call the global gmailClient to send the email with the specified recipient, message, and subject
    return await global.gmailClient.sendEmail({
        recipientEmail,
        message,
        subject,
    });
}
