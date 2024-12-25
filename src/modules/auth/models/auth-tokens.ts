class Token {
  token: string;
  expiresAt: string;
}

export class AuthTokens {
  access: Token;
  refresh: Token;
}
