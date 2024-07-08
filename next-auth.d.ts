// next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
      accessToken: string;
      // Add other custom properties here
    };
  }

  interface User {
    role: string;
    // Add other custom properties here
  }

  interface JWT {
    accessToken: string;
    // Add other custom properties here
  }
}
