'use client';

import Header from '../components/Header';
import SettingsPage from '../components/SettingsPage';

export default function SettingsRoutePage() {
  return (
    <>
      <Header currentPage="settings" />
      <SettingsPage />
    </>
  );
} 