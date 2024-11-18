import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // Nome do Provedor (Opcional, por padrão é "Credentials")
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aqui, você deve implementar a lógica de autenticação real (consultando um banco de dados, por exemplo).
        const user = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });
        if (user.ok) {
          return await user.json();
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Caminho para a página de login customizada (opcional)
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Primeiro login: adicione o access_token ao JWT
      if (user) {
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Inclua o access_token na sessão para usá-lo no frontend
      session.access_token = token.access_token as string;
      return session;
    },
  },
};
