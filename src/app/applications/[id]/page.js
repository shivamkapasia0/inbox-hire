'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { MdEmail, MdCalendarToday, MdArrowBack, MdSend, MdEdit, MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatListBulleted, MdFormatListNumbered, MdFormatQuote, MdAttachFile, MdInsertLink, MdFormatColorText, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight } from 'react-icons/md';
import { getApplicationById } from '../../utils/data';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';

export default function ApplicationDetailsPage({ params }) {
  const resolvedParams = React.use(params);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Add global styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ProseMirror {
        outline: none !important;
        border: none !important;
      }
      .ProseMirror:focus {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }
      .ProseMirror p {
        margin: 0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Highlight,
      Underline,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setReplyContent(editor.getHTML());
    },
  });

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

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/applications/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setApplication(prev => ({
        ...prev,
        status: newStatus,
        statusBadge: newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReply = async () => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/applications/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: editor.getHTML() }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      editor.commands.setContent('');
      setIsReplying(false);
      // Refresh application data
      const data = await getApplicationById(resolvedParams.id);
      setApplication(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatText = (command, value = null) => {
    if (!editor) return;

    switch (command) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'justifyLeft':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'justifyCenter':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'justifyRight':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'insertUnorderedList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'insertOrderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'formatBlock':
        if (value === 'blockquote') {
          editor.chain().focus().toggleBlockquote().run();
        }
        break;
      case 'createLink':
        if (value) {
          editor.chain().focus().setLink({ href: value }).run();
        }
        break;
      case 'foreColor':
        if (value) {
          editor.chain().focus().setColor(value).run();
        }
        break;
      default:
        break;
    }
  };

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
      {/* The main layout already provides a gradient background. We adjust padding here. */}
      <div className="min-h-screen p-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-gray-900 mb-8 transition-colors duration-200"
          >
            <MdArrowBack className="mr-2" />
            Back to Applications
          </button>

          <div className="bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-white/18 dark:border-white/10 rounded-2xl shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {application.position}
                  </h1>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{application.company}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdating}
                    className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                      application.status === 'interview' ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      application.status === 'offer' ? 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      application.status === 'rejected' ? 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-gray-100/80 text-gray-800 dark:bg-gray-600/30 dark:text-gray-200'
                    } border border-white/20 focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    <MdEdit className="mr-1" />
                    Reply
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MdEmail className="mr-2" />
                  <span>{application.from}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MdCalendarToday className="mr-2" />
                  <span>{new Date(application.date).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-200/40 dark:border-gray-700/40 pt-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Message</h2>
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: application.html }} />
                </div>
              </div>

              {isReplying && (
                <div className="mt-8 border-t border-gray-200/40 dark:border-gray-700/40 pt-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Reply</h2>
                  <div className="bg-white/40 dark:bg-gray-800/40 rounded-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <div className="border-b border-gray-200/40 dark:border-gray-700/40 p-2 flex flex-wrap gap-1">
                      <div className="flex items-center space-x-1 border-r border-gray-200/40 dark:border-gray-700/40 pr-2">
                        <button
                          onClick={() => formatText('bold')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive('bold') ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Bold"
                        >
                          <MdFormatBold className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => formatText('italic')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive('italic') ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Italic"
                        >
                          <MdFormatItalic className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => formatText('underline')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive('underline') ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Underline"
                        >
                          <MdFormatUnderlined className="text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1 border-r border-gray-200/40 dark:border-gray-700/40 pr-2">
                        <button
                          onClick={() => formatText('justifyLeft')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Align Left"
                        >
                          <MdFormatAlignLeft className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => formatText('justifyCenter')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Align Center"
                        >
                          <MdFormatAlignCenter className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => formatText('justifyRight')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Align Right"
                        >
                          <MdFormatAlignRight className="text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1 border-r border-gray-200/40 dark:border-gray-700/40 pr-2">
                        <button
                          onClick={() => formatText('insertUnorderedList')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive('bulletList') ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Bullet List"
                        >
                          <MdFormatListBulleted className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => formatText('insertOrderedList')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive('orderedList') ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Numbered List"
                        >
                          <MdFormatListNumbered className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => formatText('formatBlock', 'blockquote')}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive('blockquote') ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Quote"
                        >
                          <MdFormatQuote className="text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            const url = prompt('Enter URL:');
                            if (url) formatText('createLink', url);
                          }}
                          className={`p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded ${editor?.isActive('link') ? 'bg-gray-100/50 dark:bg-gray-700/50' : ''}`}
                          title="Insert Link"
                        >
                          <MdInsertLink className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded"
                          title="Attach File"
                        >
                          <MdAttachFile className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => {
                            const color = prompt('Enter color (e.g., #FF0000):');
                            if (color) formatText('foreColor', color);
                          }}
                          className="p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded"
                          title="Text Color"
                        >
                          <MdFormatColorText className="text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                    </div>
                    <EditorContent 
                      editor={editor} 
                      className="p-4 min-h-[200px] prose max-w-none dark:prose-invert" 
                      style={{
                        '--tiptap-focus-ring': 'none',
                        outline: 'none',
                        border: 'none',
                      }}
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleReply}
                      disabled={isUpdating || !editor?.getHTML()}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <MdSend className="mr-2" />
                      Send Reply
                    </button>
                  </div>
                </div>
              )}

              {application.reply && (
                <div className="mt-8 border-t border-gray-200/40 dark:border-gray-700/40 pt-6">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Reply</h2>
                  <div className="prose max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: application.reply }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 