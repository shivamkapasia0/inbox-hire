import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataStoreProvider } from "./utils/DataStore";
import { ToastProvider } from "./components/ToastProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { RealtimeUpdatesProvider } from "./utils/useRealtimeUpdates";
import { SettingsProvider } from "./utils/useSettings";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "InboxHire - Job Application Tracker",
  description: "Track and manage your job applications efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: '#FBF3E1',
          background: 'linear-gradient(90deg, rgba(251, 243, 225, 1) 0%, rgba(249, 222, 219, 1) 21%, rgba(212, 236, 230, 1) 98%)',
        }}
      >
        <SettingsProvider>
          <DataStoreProvider>
            <ToastProvider>
              <NotificationProvider>
                <RealtimeUpdatesProvider>
                  {children}
                  <Toaster position="top-right" />
                </RealtimeUpdatesProvider>
              </NotificationProvider>
            </ToastProvider>
          </DataStoreProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
