import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the User type to include custom fields
   */
  interface User extends DefaultUser {
    roles: string[];
    accessToken: string;
  }

  /**
   * Extend the Session type
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      roles: string[];
    } & DefaultSession["user"];
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the JWT type
   */
  interface JWT {
    id: string;
    email: string;
    name?: string;
    roles: string[];
    accessToken: string;
  }
}
