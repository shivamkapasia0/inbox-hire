'use client';

import React, { useState } from 'react';
import { FiX, FiSend, FiPaperclip, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function ApplicationDetailsModal({ application, onClose }) {
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [expandedEmails, setExpandedEmails] = useState(new Set());

  // Mock email trail data - replace with actual data from your backend
  const emailTrail = [
    {
      id: 1,
      from: 'recruiter@company.com',
      to: 'user@example.com',
      subject: 'Application for Software Engineer Position',
      body: 'Thank you for your application. We would like to schedule an interview...',
      timestamp: '2024-03-20T10:00:00Z',
      type: 'received'
    },
    {
      id: 2,
      from: 'user@example.com',
      to: 'recruiter@company.com',
      subject: 'Re: Application for Software Engineer Position',
      body: 'Thank you for your response. I would be happy to schedule an interview...',
      timestamp: '2024-03-20T11:30:00Z',
      type: 'sent'
    }
  ];

  const toggleEmail = (emailId) => {
    setExpandedEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emailId)) {
        newSet.delete(emailId);
      } else {
        newSet.add(emailId);
      }
      return newSet;
    });
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    
    setIsSending(true);
    try {
      // TODO: Implement actual email sending logic here
      // await sendEmail({
      //   to: application.contactEmail,
      //   subject: `Re: ${application.position} at ${application.company}`,
      //   body: replyText
      // });
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReplyText('');
      // TODO: Refresh email trail after sending
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{application.position}</h2>
            <p className="text-gray-600">{application.company}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Application Details */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                application.statusBadge === 'Approve' ? 'bg-green-100 text-green-700' :
                application.statusBadge === 'Overdue' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-800'
              }`}>
                {application.statusBadge}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
              <p className="text-gray-900">{application.lastUpdate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Source</h3>
              <p className="text-gray-900">{application.source}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Email</h3>
              <p className="text-gray-900">{application.contactEmail || 'Not available'}</p>
            </div>
          </div>

          {/* Email Trail */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Email Trail</h3>
            <div className="space-y-4">
              {emailTrail.map((email) => {
                const isExpanded = expandedEmails.has(email.id);
                return (
                  <div
                    key={email.id}
                    className={`rounded-lg border transition-all duration-200 ${
                      email.type === 'received'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    {/* Email Header - Always Visible */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => toggleEmail(email.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {email.type === 'received' ? 'From: ' : 'To: '}
                              {email.type === 'received' ? email.from : email.to}
                            </p>
                            <button 
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleEmail(email.id);
                              }}
                            >
                              {isExpanded ? (
                                <FiChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <FiChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(email.timestamp).toLocaleString()}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{email.subject}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          email.type === 'received'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-blue-200 text-blue-700'
                        }`}>
                          {email.type === 'received' ? 'Received' : 'Sent'}
                        </span>
                      </div>
                    </div>

                    {/* Email Body - Expandable */}
                    <div 
                      className={`overflow-hidden transition-all duration-200 ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-4 pt-0 border-t border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap">{email.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reply Section */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="w-full h-24 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSendReply}
                disabled={isSending || !replyText.trim()}
                className={`p-3 rounded-lg ${
                  isSending || !replyText.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                <FiSend className="w-5 h-5" />
              </button>
              <button
                className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => {/* TODO: Implement file attachment */}}
              >
                <FiPaperclip className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 