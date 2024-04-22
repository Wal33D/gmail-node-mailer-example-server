## Sending Service Activation Notification Emails

### Introduction
This example demonstrates how to send HTML formatted emails to notify users about service activation using the `gmail-node-mailer` package. The example showcases how to incorporate basic HTML and CSS into the email body and utilize UTF-8 characters like emojis in the email subject line.

### Example Usage
Below is a simplified example of how to send an HTML email:

```javascript
import { gmailClient } from 'gmail-node-mailer';  // Assume gmailClient is already initialized

export async function sendHtmlEmail() {
    const recipientEmail = 'user@example.com';
    const subject = '🎉 Welcome to Our Service!';
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Service Activation</title>
    </head>
    <body>
        <h1>Welcome to Our Service!</h1>
        <p>Hello,</p>
        <p>Your account has been activated successfully. You can now enjoy all our features without limitation.</p>
        <p>Best Regards,<br>Your Company Team</p>
    </body>
    </html>
    `;

    return await gmailClient.sendEmail({
        recipientEmail,
        subject,
        message,
    });
}
```

### How It Works
- **HTML Content**: The email content is formatted using basic HTML, which allows for more visually engaging email designs.
- **Email Sending**: The `sendHtmlEmail` function uses the `gmailClient` to send the email. This client should be configured to use service account credentials as described in previous setup instructions.

### Testing and Deployment
- **Test Locally**: Ensure that your local environment is configured to send emails by initializing the `gmailClient` correctly with your service account credentials.
- **Deploy**: Once verified locally, deploy your application to your production environment and test with real email addresses to confirm everything is working as expected.

### Note
- **Email Delivery**: Ensure that the `gmailClient` is properly authenticated and configured to handle sending emails to avoid issues with spam filters or undelivered emails.

By following this example, you can send well-formatted HTML emails that effectively communicate service activation details to your users. This simplifies the process and ensures your users are well-informed about their account status.
