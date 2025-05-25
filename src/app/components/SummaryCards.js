'use client';

import SummaryCard from './SummaryCard';
import { useDataStore } from '../utils/DataStore';

// Placeholder Icons (replace with actual icons later)
const UsersIcon = (props) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>;
const CalendarIcon = (props) => <svg {...props} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>;
const DocumentRemoveIcon = (props) => <svg {...props} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm1 6a1 1 0 100 2h6a1 1 0 100-2H7zm0 3a1 1 0 100 2h3a1 1 0 100-2H7zm0 3a1 1 0 100 2h3a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>;
const XCircleIcon = (props) => <svg {...props} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clip-rule="evenodd"></path></svg>;
const DocumentCheckIcon = (props) => <svg {...props} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-7a1 1 0 00-2 0v6a1 1 0 102 0V5z" clip-rule="evenodd"></path></svg>;

export default function SummaryCards() {
  const { data } = useDataStore();
  const { summaryStats } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <SummaryCard
        title="Total Applications"
        value={summaryStats.totalApplications.toString()}
        trend="25%"
        trendType="up"
        gradientClasses="bg-gradient-to-r from-yellow-100 to-yellow-300 dark:from-yellow-800 dark:to-yellow-950"
        icon={UsersIcon}
        iconColor="text-yellow-600 dark:text-yellow-300"
      />
      <SummaryCard
        title="Qualified Candidates"
        value={summaryStats.qualifiedCandidates.toString()}
        trend="10%"
        trendType="up"
        gradientClasses="bg-gradient-to-r from-red-100 to-red-300 dark:from-red-800 dark:to-red-950"
        icon={CalendarIcon}
        iconColor="text-red-600 dark:text-red-300"
      />
      <SummaryCard
        title="Interviews Scheduled"
        value={summaryStats.interviewsScheduled.toString()}
        trend="15%"
        trendType="up"
        gradientClasses="bg-gradient-to-r from-blue-100 to-blue-300 dark:from-blue-800 dark:to-blue-950"
        icon={DocumentRemoveIcon}
        iconColor="text-blue-600 dark:text-blue-300"
      />
      <SummaryCard
        title="Not Selected"
        value="0"
        trend="0%"
        trendType="up"
        gradientClasses="bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900"
        icon={XCircleIcon}
        iconColor="text-gray-600 dark:text-gray-300"
      />
      <SummaryCard
        title="Hired Candidates"
        value={summaryStats.hiredCandidates.toString()}
        trend="5%"
        trendType="up"
        gradientClasses="bg-gradient-to-r from-green-100 to-green-300 dark:from-green-800 dark:to-green-950"
        icon={DocumentCheckIcon}
        iconColor="text-green-600 dark:text-green-300"
      />
    </div>
  );
} 