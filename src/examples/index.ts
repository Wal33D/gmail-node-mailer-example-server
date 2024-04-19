export * from './sendHtmlEmail';
export * from './sendHtmlEmailWithAttachment';
export * from './sendNewPurchaseEmail';
export * from './sendPlainTextEmail';
export * from './sendServerStatusEmail';
export * from './sendSubscriptionRenewalEmail';
export type ExampleFunctions = {
    sendHtmlEmail: () => Promise<{ sent: boolean }>;
    sendHtmlEmailWithAttachment: () => Promise<{ sent: boolean }>;
    sendNewPurchaseEmail: () => Promise<{ sent: boolean }>;
    sendPlainTextEmail: () => Promise<{ sent: boolean }>;
    sendServerStatusEmail: () => Promise<{ sent: boolean }>;
    sendSubscriptionRenewalEmail: () => Promise<{ sent: boolean }>;
};