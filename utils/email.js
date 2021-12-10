const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class Email {

  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `${process.env.EMAIL_FROM}`;
  }

   getMessage(subject) {
   return {
       to: this.to,
       from: this.from,
       subject,
       text: `Hello ${this.firstName}, reset Your password using ${this.url} if already done please ignore this message`
       };
  }

  async sendPasswordReset() {
    try {
        await sendGridMail.send(this.getMessage("Your password reset token (valid for only 10 minutes)"));
        }
    catch (error) {
            console.error('Error sending test email');
            console.error(error);
       }
  }

  async sendWelcome() {
    console.log("YES")
    await this.send("welcome", "Welcome to the Traveller's Family!");
  }
};
