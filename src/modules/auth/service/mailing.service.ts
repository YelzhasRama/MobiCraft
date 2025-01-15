import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getMailgunConfig } from 'src/configs/mailgun.config';
import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class MailingService {
  mailgunConfig = getMailgunConfig();

  mailgun = new Mailgun(FormData);
  mailgunClient = this.mailgun.client({
    username: 'api',
    key: this.mailgunConfig.apiKey,
    url: this.mailgunConfig.apiUrl,
  });

  async sendEmailVerificationMail(
    userEmail: string,
    verificationCode: string,
  ): Promise<void> {
    const verificationCodeParts = {};
    verificationCode.split('').forEach((item, index) => {
      verificationCodeParts[`codeP${index + 1}`] = item;
    });

    const emailVariables = {
      email: userEmail,
      ...verificationCodeParts,
    };

    return this.sendEmail({
      destinationEmail: userEmail,
      template: this.mailgunConfig.emailVerificationTemplate,
      variables: emailVariables,
    });
  }

  private async sendEmail({
    destinationEmail,
    template,
    variables,
  }: SendEmailDto): Promise<void> {
    try {
      const result = await this.mailgunClient.messages.create(
        this.mailgunConfig.domain,
        {
          from: this.mailgunConfig.sender,
          to: destinationEmail,
          template,
          'h:X-Mailgun-Variables': JSON.stringify(variables),
        },
      );

      if (!result.id) {
        throw new InternalServerErrorException(
          'Error while sending email through mailing provider',
        );
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Mailing provider unavailable',
        err,
      );
    }
  }
}
