const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class Email {

  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Travel_Service <${process.env.EMAIL_FROM}>`;
  }

  function getMessage(subject) {
  return {
       to: this.to,
       from: this.from,
       subject,
       text: `Hello ${this.firstName}, reset Your password using ${this.url} if already done please ignore this message`,
       html: `<strong>${body}</strong>`,
       };
  }

  async function sendPasswordReset() {
    try {
        await sendGridMail.send(getMessage("Your password reset token (valid for only 10 minutes)"));
        }
    catch (error) {
            console.error('Error sending test email');
            console.error(error);
       }
  }

  async function sendWelcome() {
    await this.send("welcome", "Welcome to the Traveller's Family!");
  }
};
