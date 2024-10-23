declare module 'jsotp' {
  export class TOTP {
    constructor(secret: string);
    generate(): string;
    verify(token: string): boolean;
  }
}
