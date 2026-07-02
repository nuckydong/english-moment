import type { Metadata } from "next";
import "./globals.css";
import { StoreHydration } from "./StoreHydration";

export const metadata: Metadata = {
  title: "英语拼词小游戏 - 一年级版",
  description: "专为小学一年级学生设计的趣味英语拼词游戏，寓教于乐！",
  openGraph: {
    title: "英语拼词小游戏",
    description: "专为小学一年级学生设计的趣味英语拼词游戏",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <StoreHydration>{children}</StoreHydration>
      </body>
    </html>
  );
}
