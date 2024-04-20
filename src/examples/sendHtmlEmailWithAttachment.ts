/**
 * Example: Sending an HTML email with a text file attachment using the 'gmail-node-mailer' package.
 *
 * This function is designed to send a welcome email to new subscribers of the StreamBox service. It showcases how to send emails with HTML content and a text file attachment. The HTML format enhances the visual appeal, while the attached text file provides additional information about the subscription benefits.
 *
 * The function demonstrates the 'gmail-node-mailer' capabilities, including:
 *   - Creating HTML content for the body of the email, with styled components like headers and footers.
 *   - Encoding text content into a base64 format and attaching it as a .txt file, demonstrating the package's handling of textual attachments.
 *   - Sending emails with emoticons in the subject line, illustrating the package's support for unicode characters.
 *
 * Interface Structures:
 *   - `ISendEmailParams`:
 *     {
 *       recipientEmail: string,
 *       senderEmail?: string,  // Optional. Defaults to the email address initialized in the GmailMailer class if not provided.
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
 * This function provides a practical example of delivering customized and interactive communication to enhance user engagement and satisfaction right from the start of the subscription.
 *
 * @returns {Promise<ISendEmailResponse>} - Asynchronously sends an email and returns a promise that resolves with the outcome of the email sending operation, detailing success or failure information.
 */

import { ISendEmailParams, ISendEmailResponse } from 'gmail-node-mailer/dist/types';

export async function sendHtmlEmailWithAttachment(): Promise<ISendEmailResponse> {
    const moviePosterImagePath = 'https://res.cloudinary.com/dkfrhzkaf/image/upload/v1713597609/moviePoster.png';
    const movieFullUrl = 'https://archive.org/download/short.circuit.1986.2160p/Short.Circuit.1986.2160p.BluRay.Topaz.AMQ.Upscale.x265-SoF.mp4';
    const trailerUrl = 'https://dn720400.ca.archive.org/0/items/short-circuit/Short%20Circuit.mp4';
    const recipientEmail = 'waleed@glitchgaming.us';
    const subject = '🎬 Now Streaming: Short Circuit - Your Adventure Awaits!';

    // HTML Content
    const message = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        .container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #141414; }
        .container { max-width: 800px; margin: 20px auto; background-color: #000; color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .header { background-color: #E50914; padding: 16px 20px; font-size: 24px; font-weight: bold; text-align: center; }
        .intro-message {background-color: white; color:black;}
        .movie-poster { display: block; width: 100%; height: auto; }
        .content { padding: 20px; text-align: center; }
        .movie-info { background-color: #303030; padding: 10px 20px; }
        .movie-title { font-size: 24px; font-weight: bold; margin-top: 0; }
        .movie-details { font-size: 16px; margin: 5px 0; }
        .movie-link, .movie-link:visited { color: #46d1ff; text-decoration: none; } /* Bright blue links */
        footer { background-color: #181818; font-size: 14px; text-align: center; padding: 20px; }
        footer a, footer a:visited { color: #46d1ff; text-decoration: none; } /* Matching footer links */
        .play-button { 
            background: url('https://icon-library.com/images/play-icon-png-transparent/play-icon-png-transparent-3.jpg') center no-repeat; 
            background-size: contain; 
            position: absolute; 
            width: 100px; 
            height: 100px; 
            left: 50%; 
            top: 50%; 
            transform: translate(-50%, -50%);
        }
    </style>
    </head>
    <body>
    <p>Dear Subscriber,</p>
    <p>Thank you for signing up for StreamBox! Your subscription is now active.</p>
    <p>Dive into your new cinematic adventure with <strong>Short Circuit</strong>, available for streaming right now.</p>
    <p>Enjoy your journey with us! Happy streaming!</p>
        <div class="container">
            <div class="header">Now Streaming on StreamBox</div>
            <a href="${movieFullUrl}" target="_blank">
                <div class="movie-poster">
                    <img src="${moviePosterImagePath}" alt="Short Circuit">
                    <div class="play-button"></div>
                </div>
            </a>
            <div class="content">
                <h1>Short Circuit</h1>
                <p>Rated PG-13 | 1h 13m</p>
                <p>Join Number 5 in his thrilling adventure where he comes to life!</p>
                <p><a href="${trailerUrl}" target="_blank" class="movie-link">Watch the Trailer</a></p>
            </div>
            <footer>
                <p>For support, contact us: <a href="mailto:support@streambox.com">support@streambox.com</a></p>
            </footer>
        </div>
    </body>
    </html>`;
    // Create HTML content for the invoice attachment
    const invoiceHtmlContent = `
<html>
<body>
    <h1>StreamBox Subscription Invoice</h1>
    <p>Thank you for subscribing to StreamBox!</p>
    <p>Plan Details:</p>
    <ul>
        <li>Plan Type: Unlimited Streaming</li>
        <li>Monthly Fee: $15.99</li>
        <li>Next Billing Date: ${new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]}</li>
        <li>Added Feature: Free Access to Short Circuit - $0.00</li>
    </ul>
</body>
</html>
`;
    const invoiceBase64 = Buffer.from(invoiceHtmlContent).toString('base64');
    const attachment = {
        filename: 'StreamBox-Invoice.html',
        mimeType: 'text/html',
        content: invoiceBase64,
    };

    // Include the updated attachment in the email sending function
    return await global.gmailClient.sendEmail({
        recipientEmail,
        message,
        subject,
        attachments: [attachment]
    } as ISendEmailParams) as ISendEmailResponse;

}
