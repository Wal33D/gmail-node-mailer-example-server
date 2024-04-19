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
