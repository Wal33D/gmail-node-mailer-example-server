/**
 * Demonstration Module: gmail-node-mailer npm package Usage Examples
 *
 * This Express server application serves as a live demonstration platform for the 'gmail-node-mailer' package, showcasing various email sending scenarios using a simulated server environment.
 *
 * Demonstrations Include:
 *  - Email Types:
 *    - HTML Emails: Sends a stylized HTML email to illustrate how to include HTML content and styles in emails.
 *    - Plain Text Emails: Demonstrates sending simple text-based emails for scenarios where simplicity is key.
 *    - Emails with Attachments: Shows how to attach files (like PDFs and text files) to emails, suitable for invoices, reports, or promotional materials.
 *  - Sample Use Cases:
 *    - Subscription Renewal Emails: Sends detailed renewal confirmations with attachments, showcasing the package's utility in subscription-based services.
 *    - New Purchase Confirmations: Sends purchase confirmation emails, highlighting how to enhance customer purchase experiences with immediate confirmation.
 *    - Server Status Notifications: Automatically sends an email when the server starts or shuts down, demonstrating the package's capability to integrate with server lifecycle events.
 *
 * This server is particularly useful for developers looking to integrate email functionalities in their applications using 'gmail-node-mailer', providing practical, executable 
 *
 * Note:
 *  - The server requires certain environment variables to be set for proper configuration and operation.
 *  - Below is a sample `.env` configuration for setting up the server and email functionalities:
 *
 *    # === Server URL/PORT ===
 *    DEFAULT_URL=http://localhost:6338
 *
 *    # GmailMailer Config
 *    GMAIL_MAILER_SENDER_EMAIL=no-reply@somnuslabs.com
 *    GMAIL_MAILER_SERVICE_ACCOUNT_PATH=.\private\serviceAccount.json
 *    # Optional - you can use the path or a json object
 *    # GMAIL_MAILER_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"....iam.gserviceaccount.com","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
 */

require('dotenv-flow').config();
import fs from 'fs';
import path from 'path';
import opener from 'opener';
import express from 'express';
import serveIndex from 'serve-index';
const fetch = require('node-fetch');

import { ISendEmailResponse } from 'gmail-node-mailer/dist/types';

import { sendHtmlEmail } from './examples/sendHtmlEmail';
import { sendPlainTextEmail } from './examples/sendPlainTextEmail';
import { sendNewPurchaseEmail } from './examples/sendNewPurchaseEmail';
import { sendServerStatusEmail } from './examples/sendServerStatusEmail';
import { initializeEmailClient } from './init/initializeEmailClient';
import { sendHtmlEmailWithAttachment } from './examples/sendHtmlEmailWithAttachment';
import { sendSubscriptionRenewalEmail } from './examples/sendSubscriptionRenewalEmail';

declare global {
    var gmailClient: any;
}

const PORT = process.env.DEFAULT_URL ? parseInt(process.env.DEFAULT_URL.split(':').pop() as string) || 6338 : 6338;
const app = express();


app.get('/package-version', (req, res) => {
    // Correctly point to the package.json within node_modules at the project root
    const packagePath = path.join(__dirname, '..', 'node_modules', 'gmail-node-mailer', 'package.json');

    fs.readFile(packagePath, (err: any, data: any) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading package version');
        }
        const packageJson = JSON.parse(data);
        res.json({ version: packageJson.version }); // Send back the exact version
    });
});

// Endpoint to get the version of the demo server
app.get('/demo-server-version', (req, res) => {
    const serverPackagePath = path.join(__dirname, '..', 'package.json');
    fs.readFile(serverPackagePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading server version');
        }
        const packageJson = JSON.parse(data);
        res.json({ version: packageJson.version });
    });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/files', express.static('dummyFiles'), serveIndex('dummyFiles', { 'icons': true }));
app.use(express.static('public')); // Serve static files from 'public' directory

function setupEmailEndpoint(path: string, emailFunction: () => Promise<ISendEmailResponse>) {
    app.get(path, async (req, res) => {
        const result = await emailFunction();
        res.json({
            path: path.replace('/', '').replace(/-/g, ' ')
                .toLowerCase()  // Convert the entire string to lowercase first
                .replace(/\b\w/g, letter => letter.toUpperCase()),  // Capitalize the first letter of each word
            sent: result.sent,
            status: result.status || 'N/A',
            statusText: result.statusText || 'No status text',
            message: result.message || 'No message provided',
        });
    });
}

// Setup email endpoints
initializeEmailClient().then((emailClientResult: { gmailClient: any; }) => {
    global.gmailClient = emailClientResult.gmailClient;
    setupEmailEndpoint('/send-html-email', sendHtmlEmail);
    setupEmailEndpoint('/send-plain-text-email', sendPlainTextEmail);
    setupEmailEndpoint('/send-html-email-attachment', sendHtmlEmailWithAttachment);
    setupEmailEndpoint('/send-subscription-renewal', sendSubscriptionRenewalEmail);
    setupEmailEndpoint('/send-new-purchase', sendNewPurchaseEmail);
});

// Endpoint to simulate server start and stop notifications
app.get('/simulate-server-status', async (req, res) => {
    console.log('[Demo] Simulating server start...');
    const startEmailResult = await sendServerStatusEmail('start');
    console.log('Server Start Email Send Result:', startEmailResult.sent);

    // Introduce a delay of 2 seconds before sending the stop email
    setTimeout(async () => {
        console.log('[Demo] Simulating server shutdown...');
        const stopEmailResult = await sendServerStatusEmail('shutdown');
        console.log('Server Shutdown Email Send Result:', stopEmailResult.sent);

        // Sending both results back as an array of results
        res.json([
            { operation: 'Server Start', ...startEmailResult },
            { operation: 'Server Shutdown', ...stopEmailResult }
        ]);
    }, 2000); // 2000 milliseconds delay
});

interface NpmPackageDetails {
    packageName: string;
    totalDownloads: number;
    firstPublishDate: string;
    latestVersion: string;
    lastUpdated: string;
    license: string;
    npmUrl: string;
    repositoryUrl: string;
    authorName: string;
    description: string;
    keywords: string[];
    readme: string;
}

app.get('/npm-package-details', async (req, res) => {
    const packageName = process.env.PACKAGE_NAME || 'gmail-node-mailer';

    try {
        const packageDetails = await fetchPackageDetails(packageName);
        res.json(packageDetails);
    } catch (error) {
        console.error('Failed to fetch package details:', error);
        res.status(500).json({ error: 'Failed to fetch package details' });
    }
});


interface Metadata {
    'dist-tags': { latest: string };
    versions: { [key: string]: any };
    time: { created: string; [key: string]: string };
    readme?: string;
}

interface DownloadData {
    downloads: { day: string; downloads: number }[];
}

app.get('/npm-package-details', async (req: any, res: any) => {
    const packageName = process.env.PACKAGE_NAME || 'gmail-node-mailer';

    try {
        const metadata = await fetchData<Metadata>(`https://registry.npmjs.org/${packageName}`);
        const startDate = new Date(metadata.time.created).toISOString().slice(0, 10);
        const endDate = new Date().toISOString().slice(0, 10);
        const downloadData = await fetchData<DownloadData>(`https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${packageName}`);
        const response = formatResponse(packageName, metadata, downloadData);
        res.type('json').send(JSON.stringify(response, null, 2));
    } catch (error: any) {
        console.error('Failed to fetch package details:', error.message);
        res.status(500).json({ error: error.message });
    }
});

async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    const data: T | { error: string } = await response.json();
    if ('error' in data) {
        throw new Error(data.error);
    }
    return data;
}

function formatResponse(packageName: string, metadata: Metadata, downloadData: DownloadData) {
    const latestVersion = metadata['dist-tags'].latest;
    const versionData = metadata.versions[latestVersion];
    const totalDownloads = downloadData.downloads.reduce((sum, day) => sum + day.downloads, 0);

    return {
        packageName,
        totalDownloads,
        firstPublishDate: new Date(metadata.time.created).toISOString().slice(0, 10),
        latestVersion,
        lastUpdated: new Date(metadata.time[latestVersion]).toISOString().slice(0, 10),
        license: versionData.license || 'No license specified',
        repositoryUrl: versionData.repository?.url || 'No repository URL',
        authorName: versionData.author?.name || 'No author specified',
        description: versionData.description || 'No description available',
        keywords: versionData.keywords || [],
        npmUrl: `https://www.npmjs.com/package/${packageName}`,
        readme: metadata.readme || 'No README available'
    };
}

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// Open browser window on server start
const server = app.listen(PORT, () => {
    console.log(`[Gmail-Node-Mailer Test Server] - Server is listening on port: ${PORT}`);
    opener(`http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
});
