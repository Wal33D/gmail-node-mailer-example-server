import fs from 'fs';
import path from 'path';

import { Router } from 'express';

import { sendHtmlEmail } from './examples/sendHtmlEmail';
import { sendPlainTextEmail } from './examples/sendPlainTextEmail';
import { fetchPackageDetails } from './npm/packageDetails';
import { sendNewPurchaseEmail } from './examples/sendNewPurchaseEmail';
import { sendServerStatusEmail } from './examples/sendServerStatusEmail';
import { sendHtmlEmailWithAttachment } from './examples/sendHtmlEmailWithAttachment';
import { sendSubscriptionRenewalEmail } from './examples/sendSubscriptionRenewalEmail';

export const router = Router();

// Email sending endpoints
router.get('/send-html-email', async (req, res) => {
    const result = await sendHtmlEmail();
    res.json({ operation: 'Send HTML Email', ...result });
});

router.get('/send-plain-text-email', async (req, res) => {
    const result = await sendPlainTextEmail();
    res.json({ operation: 'Send Plain Text Email', ...result });
});

router.get('/send-html-email-attachment', async (req, res) => {
    const result = await sendHtmlEmailWithAttachment();
    res.json({ operation: 'Send HTML Email with Attachment', ...result });
});

router.get('/send-subscription-renewal', async (req, res) => {
    const result = await sendSubscriptionRenewalEmail();
    res.json({ operation: 'Send Subscription Renewal Email', ...result });
});

router.get('/send-new-purchase', async (req, res) => {
    const result = await sendNewPurchaseEmail();
    res.json({ operation: 'Send New Purchase Email', ...result });
});

// Endpoint to simulate server status notifications
router.get('/simulate-server-status', async (req, res) => {
    console.log('[Demo] Simulating server start...');
    const startResult = await sendServerStatusEmail('start');
    console.log('Server Start Email Send Result:', startResult.sent);

    setTimeout(async () => {
        console.log('[Demo] Simulating server shutdown...');
        const stopResult = await sendServerStatusEmail('shutdown');
        console.log('Server Shutdown Email Send Result:', stopResult.sent);

        res.json([
            { operation: 'Server Start', ...startResult },
            { operation: 'Server Shutdown', ...stopResult }
        ]);
    }, 500);
});

// Endpoint for getting package version
router.get('/package-version', async (req, res) => {
    const packagePath = path.join(__dirname, '..', 'node_modules', 'gmail-node-mailer', 'package.json');
    fs.readFile(packagePath, (err, data) => {
        if (err) return res.status(500).send('Error reading package version');
        const packageJson = JSON.parse(data.toString());
        res.json({ version: packageJson.version });
    });
});

// Endpoint for getting demo server version
router.get('/demo-server-version', async (req, res) => {
    const serverPackagePath = path.join(__dirname, '..', 'package.json');
    fs.readFile(serverPackagePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading server version');
        const packageJson = JSON.parse(data);
        res.json({ version: packageJson.version });
    });
});

// Endpoint for npm package details
router.get('/npm-package-details', async (req, res) => {
    const packageName = process.env.PACKAGE_NAME || 'default-package-name';
    try {
        const packageDetails = await fetchPackageDetails(packageName);
        res.json(packageDetails);
    } catch (error) {
        console.error('Failed to fetch package details:', error);
        res.status(500).json({ error: 'Failed to fetch package details' });
    }
});

export default router;
