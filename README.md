# gmail-node-mailer-test-server

This project is designed as a simple, lightweight testing server that integrates with Gmail via NodeMailer to send emails. It's perfect for developers who need to test email functionalities in their applications without the hassle of setting up a full-fledged email server.

## Features

- **Simple Configuration**: Easy setup with minimal configuration, just input your Gmail credentials and you're good to go.
- **Secure**: Implements OAuth2 for secure access to Gmail.
- **Template Support**: Offers the ability to use HTML templates for emails, making it easier to send beautiful emails.
- **Attachments Support**: Allows sending emails with attachments, providing flexibility for various test scenarios.
- **Logging**: Full logging of sending activities, so you can debug and improve email sending functionality.
- **Lightweight**: Designed to be minimal and efficient, not overloading your testing environment.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- A Gmail account with "Less secure app access" enabled or OAuth2 configured.

### Installation

1. Clone the repository:

```
git clone https://github.com/your-username/gmail-node-mailer-test-server.git
```

2. Navigate to the project directory:

```
cd gmail-node-mailer-test-server
```

3. Install the required dependencies:

```
npm install
```

4. Configure your Gmail settings in a `.env` file at the root of the project:

```
GMAIL_USER=your@gmail.com
GMAIL_PASS=yourpassword
GMAIL_OAUTH_CLIENT_ID=your_oauth_client_id
GMAIL_OAUTH_CLIENT_SECRET=your_oauth_client_secret
GMAIL_OAUTH_REFRESH_TOKEN=your_oauth_refresh_token
```

### Usage

1. Start the server:

```
node server.js
```

2. Send a test email using the provided API endpoint:

```
POST /send-email
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "text": "This is a test email sent from gmail-node-mailer-test-server.",
  "html": "<p>This is a test email sent from gmail-node-mailer-test-server.</p>"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have feedback, suggestions, or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is for testing purposes only. Please ensure you follow Gmail's usage policies and guidelines.