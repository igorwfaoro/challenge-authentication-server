import { injectable } from 'inversify';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { CONFIG } from '../config';
import { MessagingException } from '../common/exceptions/messaging.exception';

export interface EmailOptions {
    emails: string[];
    message: string;
    subject?: string;
}

@injectable()
export class MessagingService {

    public async sendEmail(options: EmailOptions): Promise<any> {

        if (!options.subject)
            options.subject = 'Messaging from IWF Authentication Server';

        const transporter = nodemailer.createTransport({
            service: CONFIG.EMAIL_SERVICE,
            auth: {
                user: CONFIG.EMAIL_USER,
                pass: CONFIG.EMAIL_PASSWORD
            }
        });

        const mailOptions: Mail.Options = {
            from: CONFIG.EMAIL_USER,
            to: options.emails.join(','),
            subject: options.subject,
            html: options.message
        }

        try {
            const result = await transporter.sendMail(mailOptions);
            return result;
        } catch (error) {
            throw new MessagingException('Error sending e-mail');
        }
    }
}