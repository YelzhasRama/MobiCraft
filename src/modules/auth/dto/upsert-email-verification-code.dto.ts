export class UpsertEmailVerificationCodeDto {
  userId: number;
  code: string;
  expiresAt: string;
}
