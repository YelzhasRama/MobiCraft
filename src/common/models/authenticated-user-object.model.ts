export class AuthenticatedUserObject {
  userId: number;
  refreshToken: string;
}

export const isUser = (object: any): object is AuthenticatedUserObject => {
  return object.userId !== undefined;
};
