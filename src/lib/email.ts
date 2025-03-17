import { EmailClient } from '@azure/communication-email';
import { WelcomeEmail, VercelInviteUserEmail } from '@/components/email/invite';
import { render } from '@react-email/render';

const connectionString = process.env.AZURE_EMAIL_CONNECTION_STRING!;
const senderAddress = process.env.AZURE_EMAIL_ADDRESS!;
const client = new EmailClient(connectionString);

export async function sendEmail(toEmail: string, userName: string = "אלכס") {
    // Render the welcome email component to HTML
    const emailHtml = await render(WelcomeEmail({ userName }));

    const emailMessage = {
        senderAddress: senderAddress,
        content: {
            subject: "ברוכים הבאים למערכת ניהול הפרויקטים",
            plainText: "ברוכים הבאים למערכת ניהול הפרויקטים שלנו. מתרגשים לראות אותך מצטרף!",
            html: emailHtml,
        },
        recipients: {
            to: [{ address: toEmail }],
        },
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    return result;
}

export async function sendInviteEmail(toEmail: string, projectName: string, username: string,
    invitedByUsername: string, invitedByEmail: string, inviteLink: string,
) {
    // Render the welcome email component to HTML
    const emailHtml = await render(VercelInviteUserEmail({ projectName, username, invitedByEmail, invitedByUsername, inviteLink }));

    const emailMessage = {
        senderAddress: senderAddress,
        content: {
            subject: `פרוייקט פתרו"ן - הזמנה חדשה לפרויקט`,
            plainText: "ברוכים הבאים למערכת ניהול הפרויקטים שלנו. מתרגשים לראות אותך מצטרף!",
            html: emailHtml,
        },
        recipients: {
            to: [{ address: toEmail }],
        },
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    return result;
}
