import Image from "next/image";
import Header from './components/Header';
import DashboardHeader from './components/DashboardHeader';
import SummaryCards from './components/SummaryCards';
import DashboardSection from './components/DashboardSection';
import WorkingType from './components/WorkingType';
import ApplicationsTable from './components/ApplicationsTable';
import NotQualifiedOverview from './components/NotQualifiedOverview';
import ImpressionsChart from './components/ImpressionsChart';
import { MdOutlineDocumentScanner } from 'react-icons/md';

export default function Home() {
  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
      <Header />
      {/* <DashboardHeader /> */}
      <main className="p-4 md:p-5 lg:p-6">
        {/* Greeting and Summary Cards Section */}
        <div className="rounded-lg shadow p-6 bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-white/18 dark:border-white/10  rounded-2xl shadow-lg p-5 mb-4">
          <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Good Morning, Welcome back!
          </h1>
          <SummaryCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-1">
            <DashboardSection title="Working Type">
              <WorkingType />
            </DashboardSection>
          </div>
          <div className="lg:col-span-2">
            <DashboardSection 
              title={
                <div className="flex items-center gap-2">
                  <MdOutlineDocumentScanner className="w-6 h-6" />
                  <span>Applications</span>
                </div>
              }
              variant="applications"
            >
              <ApplicationsTable />
            </DashboardSection>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <DashboardSection title="Jobs Applied Overview">
            <NotQualifiedOverview />
          </DashboardSection>
          <DashboardSection title="Impressions">
            <ImpressionsChart />
          </DashboardSection>
        </div>
      </main>
    </div>
  );
}
