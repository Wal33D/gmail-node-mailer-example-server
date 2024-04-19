import fs from 'fs';
import path from 'path';
import { GmailMailer } from 'gmail-node-mailer';

export const initializeEmailClient = async (): Promise<{
    status: boolean;
    gmailClient: any | null;
    message: string;
}> => {
    const gmailMailer = new GmailMailer();
    let gmailServiceAccount;

    try {
        const gmailSenderEmail = process.env.GMAIL_MAILER_SENDER_EMAIL;
        if (!gmailSenderEmail) {
            throw new Error(`[Email Client] - GMAIL_MAILER_SENDER_EMAIL environment variable is not defined.`);
        }

        // Attempt to use the service account JSON string from the environment variable
        if (process.env.GMAIL_MAILER_SERVICE_ACCOUNT) {
            gmailServiceAccount = JSON.parse(process.env.GMAIL_MAILER_SERVICE_ACCOUNT);
        } else if (process.env.GMAIL_MAILER_SERVICE_ACCOUNT_PATH) {
            // If the service account JSON string isn't available, look for the file path
            const gmailServiceAccountPath = process.env.GMAIL_MAILER_SERVICE_ACCOUNT_PATH;
            const absolutePath = path.resolve(gmailServiceAccountPath);
            if (!fs.existsSync(absolutePath)) {
                throw new Error(`[Email Client] - File not found at ${absolutePath}`);
            }

            gmailServiceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
        } else {
            throw new Error('[Email Client] - Both GMAIL_MAILER_SERVICE_ACCOUNT and GMAIL_MAILER_SERVICE_ACCOUNT_PATH environment variables are not defined.');
        }

        // Initialize the GmailMailer client
        const initResult = await gmailMailer.initializeClient({
            gmailServiceAccount,
            gmailSenderEmail,
        });

        if (!initResult.status) {
            throw new Error(`Failed to initialize: ${initResult.message}`);
        }

        return {
            status: true,
            gmailClient: gmailMailer, // Return the GmailMailer instance
            message: `[Mailer Initialization] - Success`,
        };
    } catch (error: any) {
        return {
            status: false,
            gmailClient: null,
            message: `[Mailer Initialization] - Failed: ${error.message}`,
        };
    }
};
