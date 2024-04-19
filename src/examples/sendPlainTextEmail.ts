/**
 * Example: Sending a plain text email using the 'gmail-node-mailer' package.
 *
 * This function is specifically designed to send simple, plain text emails without HTML content. It's suitable for sending straightforward, text-based communications such as notifications, alerts, or basic welcome messages.
 *
 * This function utilizes the 'gmail-node-mailer' package to:
 *   - Send plain text emails efficiently with minimal configuration.
 *   - Ensure that the content is straightforward and easily readable without the need for HTML formatting.
 *   - Provide a simple and direct method for sending text messages, making it ideal for applications that require non-complex email solutions.
 *
 * Interface Structures:
 *   - `ISendEmailParams`:
 *     {
 *       recipientEmail: string,
 *       message: string,
 *       senderEmail?: string,  // Optional. Defaults to the email address initialized in the GmailMailer class if not provided.
 *       subject?: string,  // Optional. Defaults to 'No Subject' if not provided.
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
 * The simplicity of this function makes it highly effective for quick communications where complex HTML emails are unnecessary.
 *
 * @returns {Promise<ISendEmailResponse>} - Asynchronously sends an email and returns a promise that resolves with the outcome of the email sending operation, detailing success or failure information.
 */

import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer/dist/types';

export async function sendPlainTextEmail(): Promise<ISendEmailResponse> {
    // Define the recipient's email address to whom the email will be sent.
    const recipientEmail = 'customer@glitchgaming.us'; 
    // Optionally define the subject with emojis or special characters; automatically encoded to Base64. Defaults to 'No Subject' if not provided.
    const subject = 'Plain Text Email Demo: Welcome Aboard!';
    // Define the plain text message to be sent, containing simple and direct content for easy reading.
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
    } as ISendEmailParams) as ISendEmailResponse;
}
