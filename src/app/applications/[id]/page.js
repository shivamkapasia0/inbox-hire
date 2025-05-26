'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { MdEmail, MdCalendarToday, MdArrowBack } from 'react-icons/md';
import { getApplicationById } from '../../utils/data';

export default function ApplicationDetailsPage({ params }) {
  const resolvedParams = React.use(params);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await getApplicationById(resolvedParams.id);
        setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <>
        <Header currentPage="applications" />
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header currentPage="applications" />
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header currentPage="applications" />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <MdArrowBack className="mr-2" />
            Back to Applications
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {application.position}
                  </h1>
                  <p className="mt-1 text-gray-600">{application.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                  application.status === 'offer' ? 'bg-green-100 text-green-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {application.statusBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MdEmail className="mr-2" />
                  <span>{application.from}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MdCalendarToday className="mr-2" />
                  <span>{new Date(application.date).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Message</h2>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: application.html }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 