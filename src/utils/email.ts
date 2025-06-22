import nodemailer from "nodemailer";
import config from "config";
import { Prisma } from "../generated/client";
import pug from "pug";
import { convert } from "html-to-text";

const smtp = config.get<{
  host: string;
  port: number;
  user: string;
  pass: string;
}>("smtp");

const gmail = config.get<{
  googleAppPassword: string;
  googleSenderMail: string;
  googleUser: string;
}>("gmail");

export default class Email {
  #firstname: string;
  #to: string;
  #from: string;
  constructor(private user: Prisma.UserCreateInput, private url: string) {
    this.#firstname = user.name.split(" ")[0];
    this.#to = user.email;
    this.#from = gmail.googleSenderMail;
  }

  private newTransport() {
    return nodemailer.createTransport({
      // ...gmail,
      service: "gmail",
      secure: false,
      auth: { user: gmail.googleUser, pass: gmail.googleAppPassword },
    });
  }

  private async send(template: string, subject: string) {
    try {
      const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
        firstName: this.#firstname,
        subject,
        url: this.url,
      });

      // create mailoptions
      const mailOptions = {
        from: this.#from,
        to: this.#to,
        subject,
        text: convert(html),
        html,
      };

      // Send email
      const info = await this.newTransport().sendMail(mailOptions);
      console.log("Email verification has been sent successfully");
      // console.log("nodemailer message: ", nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error("❌ Failed to send email.");
      console.error("📄 Template:", template);
      console.error("📨 To:", this.#to);
      console.error("💥 Error Message:", (err as Error).message);
      console.error("🔍 Stack Trace:", (err as Error).stack);
      throw err;
    }
    // Generate html based on template string
  }

  async sendVerificationCode() {
    await this.send("verificationCode", "Your account verification code");
  }

  async sendPasswordResetToken() {
    await this.send(
      "resetPassword",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}
