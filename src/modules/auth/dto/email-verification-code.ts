export class EmailVerificationCode {
  id: number;
  userId: number;
  code: string;
  usedAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
