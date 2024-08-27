import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Box, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { darkTheme as theme } from "@/theme";
import Header from "@/layouts/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack
              display={"grid"}
              height={"100%"}
              gridTemplateRows={"auto 1fr"}
            >
              <Header></Header>
              <Box
                component={"main"}
                minHeight={0}
                className="overflow-x-hidden"
              >
                {children}
              </Box>
            </Stack>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
