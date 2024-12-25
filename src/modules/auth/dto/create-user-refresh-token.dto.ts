export class CreateUserRefreshTokenDto {
  userId: number;
  token: string;
  expiresAt: string;
}
