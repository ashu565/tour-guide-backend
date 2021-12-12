const sendGridMail = require('@sendgrid/mail');
const AppError = require('./appError');

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.firstName;
        this.url = url;
        this.from = `Travel_Service <${process.env.EMAIL_FROM}>`;
    }

    getMessage(subject) {
        return {
            to: this.to,
            from: this.from,
            subject,
            html: `Hello ${this.firstName}, <p>You're almost ready to reset your password! </p>
            <h4>Click on the link below to reset your password.</h4>
            ${this.url}
            `,
        };
    }

    async sendPasswordReset() {
        try {
            await sendGridMail.send(
                this.getMessage(
                    'Your password reset token (valid for only 10 minutes)'
                )
            );
        } catch (error) {
            console.error('Error sending test email');
            console.error(error);
            return next(
                new AppError('Something went wrong, could not send token '),
                500
            );
        }
    }

    async sendWelcome() {
        await this.send('welcome', "Welcome to the Traveller's Family!");
    }
};
