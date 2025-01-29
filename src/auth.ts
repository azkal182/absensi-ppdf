import NextAuth from "next-auth"
import authConfig from "./auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    pages: {
        signIn: "/login"
    },
    session: { strategy: 'jwt', maxAge: 60 * 60 },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    callbacks: {
        async session({ token, session }) {
            if (session.user) {
                return {
                    ...session,
                    user: {
                        id: token.sub,
                        name: token.name,
                        username: token.username,
                        role: token.role,
                    },
                };
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.name = user.name;
                token.username = user.username;
                token.role = user.role;
            }

            return token;
        },
    },

})
