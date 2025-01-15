export class SendEmailDto {
  destinationEmail: string;
  template: string;
  variables: Record<string, string | number>;
}
