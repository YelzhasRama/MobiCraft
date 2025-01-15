import { config } from 'dotenv';

config();

export const getMailgunConfig = () => ({
  domain: process.env.MAILGUN_DOMAIN,
  apiKey: process.env.MAILGUN_API_KEY,
  apiUrl: process.env.MAILGUN_API_URL,
  sender: process.env.MAILGUN_SENDER,
  emailVerificationTemplate: process.env.MAILGUN_EMAIL_VERIFICATION_TEMPLATE,
  emailVerificationSubject: process.env.MAILGUN_EMAIL_VERIFICATION_SUBJECT,
  passwordResetTemplate: process.env.MAILGUN_PASSWORD_RESET_TEMPLATE,
  passwordResetSubject: process.env.MAILGUN_PASSWORD_RESET_SUBJECT,
  recipient: process.env.MAILGUN_RECIPIENT,
  contentFeedbackTemplate: process.env.MAILGUN_CONTENT_FEEDBACK_TEMPLATE,
  contentFeedbackSubject: process.env.MAILGUN_CONTENT_FEEDBACK_SUBJECT,
  contentIssueTemplate: process.env.MAILGUN_CONTENT_ISSUE_TEMPLATE,
  contentIssueSubject: process.env.MAILGUN_CONTENT_ISSUE_SUBJECT,
  issueTemplate: process.env.MAILGUN_ISSUE_TEMPLATE,
  issueSubject: process.env.MAILGUN_ISSUE_SUBJECT,
});

// import nodemailer from 'nodemailer';
// import mg from 'nodemailer-mailgun';

// export const getMailgunConfig = {
//   url: 'https://api.eu.mailgun.net',
//   auth: {
//     apiKey: process.env.MAILGUN_API_KEY!,
//     domain: 'mg.sbdifi.kz',
//   },
// };
//
// export const mailer = nodemailer.createTransport(mg(getMailgunConfig));
//
// export default mailer;
