'use client';

import Header from '../components/Header';
import ApplicationsPage from '../components/ApplicationsPage';

export default function ApplicationsRoutePage() {
  // No-op function for navigation
  const setCurrentPage = () => {};

  return (
    <>
      <Header currentPage="applications" setCurrentPage={setCurrentPage} />
      <ApplicationsPage />
    </>
  );
} 