import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Delivery System",
  description: "Sistema de registro de entregas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: "0"}}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
