/**
 * Example: Sending a service activation notification email using the 'gmail-node-mailer' package.
 *
 * This function demonstrates how to send HTML formatted emails with predefined styles to notify users about service activation. 
 *
 * The function sends an email with a subject celebrating the user's service activation and includes basic contact information in the footer. It leverages the 'gmail-node-mailer' package to:
 *   - Send HTML emails that incorporate style elements directly within the email body.
 *   - Utilize special characters like emojis in the email subject line, demonstrating the package's handling of UTF-8 characters.
 *
 * Interface Structures:
 *   - `ISendEmailParams`:
 *     {
 *       recipientEmail: string,
 *       senderEmail?: string,  // Optional. Defaults to the email address initialized in the GmailMailer class if not provided.
 *       senderName?: string;// Optional. Defaults to the string after the @ symbol in the senderEmail if not provided.
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
 * This example illustrates the simplicity and effectiveness of communicating essential service information via the 'gmail-node-mailer' package.
 *
 * @returns {Promise<ISendEmailResponse>} - Asynchronously sends an email and returns a promise that resolves with the outcome of the email sending operation, detailing success or failure information.
 */

import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer';

export async function sendHtmlEmail(): Promise<ISendEmailResponse> {
    const recipientEmail = 'waleed@glitchgaming.us';
    const subject = '🎉 HTML Email Demo with gmail-node-mailer!';
    const senderName = 'gmail-node-mailer';
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, html { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
            .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; text-align: left; font-size: 16px; color: #333; }
            .code { background-color: #e8f0fe; padding: 15px; font-family: monospace; color: #0056b3; border-left: 5px solid #0056b3; margin-top: 20px; }
            .footer { background-color: #003366; color: white; padding: 20px; text-align: center; }
            a { color: #FFD700; text-decoration: none; font-weight: bold; }
            a:hover { text-decoration: underline; }
            @media (max-width: 600px) {
                .header, .content, .footer { padding: 15px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to the gmail-node-mailer Demo!</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Before you can send emails, you need to initialize the gmail-node-mailer client. This involves setting up the sender's email and the service account configuration. The package allows two ways to specify the service account:</p>
                <ul>
                    <li>Directly by providing the JSON data through an environment variable.</li>
                    <li>By specifying a file path to the JSON file that contains the service account details.</li>
                </ul>
                <p>Here’s how you can configure your client securely using one of these methods:</p>
                <pre class="code">import { GmailMailer } from 'gmail-node-mailer';
    const gmailMailer = new GmailMailer();
    
    const gmailSenderEmail = process.env.GMAIL_MAILER_SENDER_EMAIL;
    let gmailServiceAccount;
    
    if (process.env.GMAIL_MAILER_SERVICE_ACCOUNT) {
        gmailServiceAccount = JSON.parse(process.env.GMAIL_MAILER_SERVICE_ACCOUNT);
    } else {
        gmailServiceAccount = JSON.parse(fs.readFileSync(process.env.GMAIL_MAILER_SERVICE_ACCOUNT_PATH, 'utf8'));
    }
    
    const { status, gmailClient, message } = await initializeEmailClient({
        gmailServiceAccount,
        gmailSenderEmail
    });
    
    if (status) {
        console.log('Initialization successful!');
    } else {
        console.error('Initialization failed:', message);
    }</pre>
                <p>Once initialized, sending an email is straightforward:</p>
                <pre class="code">const response = await gmailClient.sendEmail({
        recipientEmail: 'recipient@example.com',
        message: 'Hello, this is a test message sent from gmail-node-mailer!',
        subject: 'Test Email'
    });
    console.log(response);</pre>
                <p>Here's an example of what the response might look like:</p>
                <pre class="code">{
        sent: true,
        status: 200,
        statusText: 'OK',
        responseUrl: 'https://gmail.googleapis.com/gmail/v...',
        message: 'Email successfully sent to recipient@example.com.',
        gmailResponse: {/* Gmail Response Object */}
    }</pre>
                <p>Your account is now fully activated, and you can begin exploring all our features.</p>
            </div>
            <div class="footer">
                <p>Need assistance? Contact us at <a href="mailto:support@gmail-node-mailer-demo.com">support@gmail-node-mailer-demo.com</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    return await global.gmailClient.sendEmail({
        recipientEmail,
        senderName,
        message,
        subject,
    } as ISendEmailParams) as ISendEmailResponse;
}
