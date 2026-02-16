import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

const hasDatabase = !!process.env.DATABASE_URL;

const getAdapter = () => {
  if (!hasDatabase) return undefined;
  const { prisma } = require('./prisma');
  return PrismaAdapter(prisma) as any;
};

export const authOptions: NextAuthOptions = {
  adapter: getAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Demo Account',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@purdue.edu' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Always return demo user - no database required
        const demoUser = {
          id: `demo-${credentials.email.replace(/[^a-z0-9]/gi, '')}`,
          email: credentials.email,
          name: credentials.email.split('@')[0],
        };

        // Try database if available, but fall back to demo on any error
        if (process.env.DATABASE_URL) {
          try {
            const { prisma } = require('./prisma');
            let user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  email: credentials.email,
                  name: credentials.email.split('@')[0],
                },
              });
            }
            return user;
          } catch (error) {
            console.log('Database unavailable, using demo mode');
            return demoUser;
          }
        }

        return demoUser;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};
