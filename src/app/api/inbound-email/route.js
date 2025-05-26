import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const rawJson = {
    "FromName": "shivam kapasia",
    "MessageStream": "inbound",
    "From": "shivam@shivamkapasia.dev",
    "FromFull": {
      "Email": "shivam@shivamkapasia.dev",
      "Name": "shivam kapasia",
      "MailboxHash": ""
    },
    "To": "\"cac0731fa0b48a89b6bb9d12bca81e59+c8819ae7013a6f1294da41992e1cc048@inbound.postmarkapp.com\" <cac0731fa0b48a89b6bb9d12bca81e59+c8819ae7013a6f1294da41992e1cc048@inbound.postmarkapp.com>",
    "ToFull": [
      {
        "Email": "cac0731fa0b48a89b6bb9d12bca81e59+c8819ae7013a6f1294da41992e1cc048@inbound.postmarkapp.com",
        "Name": "cac0731fa0b48a89b6bb9d12bca81e59+c8819ae7013a6f1294da41992e1cc048@inbound.postmarkapp.com",
        "MailboxHash": "c8819ae7013a6f1294da41992e1cc048"
      }
    ],
    "Cc": "",
    "CcFull": [],
    "Bcc": "",
    "BccFull": [],
    "OriginalRecipient": "cac0731fa0b48a89b6bb9d12bca81e59+c8819ae7013a6f1294da41992e1cc048@inbound.postmarkapp.com",
    "Subject": "JOb Application - this is test subject",
    "MessageID": "f09ce332-34be-48b1-9547-b2d2b8800007",
    "ReplyTo": "",
    "MailboxHash": "c8819ae7013a6f1294da41992e1cc048",
    "Date": "Mon, 26 May 2025 08:34:50 +0530 (IST)",
    "TextBody": "Hi There,\n \nThis is test email body. You have been selected for the interview. Please find the details below.\n \nRegards,\nShivam",
    "HtmlBody": "<!doctype html>\n<html>\n <head>\n  <meta charset=\"UTF-8\">\n </head>\n <body>\n  <div class=\"default-style\">\n   Hi <strong>There</strong>,\n  </div>\n  <div class=\"default-style\">\n   &nbsp;\n  </div>\n  <div class=\"default-style\">\n   This is test email body. You have been selected for the interview. Please find the details below.\n  </div>\n  <div class=\"default-style\">\n   &nbsp;\n  </div>\n  <div class=\"default-style\">\n   <strong>Regards</strong>,\n  </div>\n  <div class=\"default-style\">\n   Shivam\n  </div>\n </body>\n</html>",
    "StrippedTextReply": "",
    "Tag": "",
    "Headers": [
      {
        "Name": "Return-Path",
        "Value": "<shivam@shivamkapasia.dev>"
      },
      {
        "Name": "Received",
        "Value": "by p-pm-inboundg03a-aws-euwest1a.inbound.postmarkapp.com (Postfix, from userid 996)\tid C4B3E453B34; Mon, 26 May 2025 03:04:55 +0000 (UTC)"
      },
      {
        "Name": "X-Spam-Checker-Version",
        "Value": "SpamAssassin 3.4.0 (2014-02-07) on\tp-pm-inboundg03a-aws-euwest1a"
      },
      {
        "Name": "X-Spam-Status",
        "Value": "No"
      },
      {
        "Name": "X-Spam-Score",
        "Value": "-0.1"
      },
      {
        "Name": "X-Spam-Tests",
        "Value": "DKIM_SIGNED,DKIM_VALID,DKIM_VALID_AU,HTML_MESSAGE,\tRCVD_IN_DNSWL_NONE,RCVD_IN_VALIDITY_RPBL_BLOCKED,\tRCVD_IN_VALIDITY_SAFE_BLOCKED,RCVD_IN_ZEN_BLOCKED_OPENDNS,SPF_HELO_PASS,\tSPF_PASS"
      },
      {
        "Name": "Received-SPF",
        "Value": "pass (shivamkapasia.dev: Sender is authorized to use 'shivam@shivamkapasia.dev' in 'mfrom' identity (mechanism 'include:secureserver.net' matched)) receiver=p-pm-inboundg03a-aws-euwest1a; identity=mailfrom; envelope-from=\"shivam@shivamkapasia.dev\"; helo=sxb1plwbeout06.prod.sxb1.secureserver.net; client-ip=188.121.53.240"
      },
      {
        "Name": "Received",
        "Value": "from sxb1plwbeout06.prod.sxb1.secureserver.net (sxb1plwbeout06.prod.sxb1.secureserver.net [188.121.53.240])\t(using TLSv1.2 with cipher ECDHE-RSA-AES256-GCM-SHA384 (256/256 bits))\t(No client certificate requested)\tby p-pm-inboundg03a-aws-euwest1a.inbound.postmarkapp.com (Postfix) with ESMTPS id 47E2B40584A\tfor <cac0731fa0b48a89b6bb9d12bca81e59+c8819ae7013a6f1294da41992e1cc048@inbound.postmarkapp.com>; Mon, 26 May 2025 03:04:55 +0000 (UTC)"
      },
      {
        "Name": "X-MW-NODE",
        "Value": ""
      },
      {
        "Name": "DKIM-Signature",
        "Value": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=shivamkapasia.dev;\ts=secureserver1; t=1748228694;\tbh=kOWAcKFNlvfPauyTaS8fNFHU3TQb6QDk3gU7DhW6Otk=;\th=Date:From:To:Subject;\tb=fNaoqkHSoyd0v2iFz7niaDoIyPLDMT4z8ihTT/x0GrgpFc1wIG+oGBtdW4S9r41iw\t Ai0MPgS8fGa+as6S7jw5t25P2o+rgREZph845nYdgHkiTYONbNxMzTjNq7XRADvOUe\t CPFUUuQLvBifYliK9OskRoEzZbhipIEaSNyvVV0M0/Iu/+ENOeRhMp2YlV+C9CuhD2\t cxoN10hw5VZUA8gGkgH6Wy0AiPZVLHUdQsAY+rp3CKt3un+gqWhPpIIn4h/sDdMNTC\t 9M7eBDt5S1uE3ObhbuQ+grVJXScg5/mjgQ2CKUmLMAevy9JDZTUD5MJ9RTWyV5Dgb9\t ilpf2EI05eFcA=="
      },
      {
        "Name": "X-CMAE-Analysis",
        "Value": "v=2.4 cv=Qdlmvtbv c=1 sm=1 tr=0 ts=6833da55 a=dXjjPwzvD9j7BgnZe+pVUQ==:117 a=dXjjPwzvD9j7BgnZe+pVUQ==:17 a=WWKMtiynAJAA:10 a=8QWaRyhE7CVHpXgfXEAA:9 a=QEXdDO2ut3YA:10 a=aOpAVqHek2v2v_cdtX4A:9 a=_W_S_7VecoQA:10 a=3EEpPFJNj_L18h_vXmGP:22"
      },
      {
        "Name": "X-SECURESERVER-ACCT",
        "Value": "shivam@shivamkapasia.dev"
      },
      {
        "Name": "X-SID",
        "Value": "JO8xueop56l1v"
      },
      {
        "Name": "Message-ID",
        "Value": "<185912279.745417.1748228690911@ap1.myprofessionalmail.com>"
      },
      {
        "Name": "MIME-Version",
        "Value": "1.0"
      },
      {
        "Name": "X-Priority",
        "Value": "3"
      },
      {
        "Name": "Importance",
        "Value": "Normal"
      },
      {
        "Name": "X-Mailer",
        "Value": "Open-Xchange Mailer v8.37.62"
      },
      {
        "Name": "X-Originating-IP",
        "Value": "103.240.195.126"
      },
      {
        "Name": "X-Originating-Port",
        "Value": "38878"
      },
      {
        "Name": "X-Originating-Client",
        "Value": "open-xchange-appsuite"
      },
      {
        "Name": "X-CMAE-Envelope",
        "Value": "MS4xfAN0wr8WbRm07imjMbVfd0u69IozDZiPFmNyl4jBQa1QsOE3B8vA/PUwbCuZ+NCSY3Q2i4pJu1EvTt9q1Gugn8xw9AAbGXeit5hUyxXa3D/KozFgsAP7 qMrXYIjdRUBwC4wmxL6YVL5WB0jHd5UInbKDPDgKLLJsSO4vMxC0mfFgW61of6nlUTii60KyZD4KVxw8uKZepUUnDde/+Eivs0B6FRTQK+RNtKlqEFMCyqoA iIWE+ott3/2AdGu4bqRLfKIxHYMQUDsNVvsWI1OieYrAAZ/n7xj61AQDDpR7/CUd4Mz8Vgkz57xuXCq9tf75hNvGJAjh0VvXtYL5Ghi7UJo="
      }
    ],
    "Attachments": []
  };

// Helper function to detect email status
function detectStatus(subject, textBody) {
  const content = (subject + ' ' + textBody).toLowerCase();
  if (content.includes('rejected')) return 'rejected';
  if (content.includes('interview')) return 'interview';
  if (content.includes('offer')) return 'offer';
  return 'other';
}

// Helper function to ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Helper function to safely parse JSON
function safeJsonParse(str) {
  try {
    // First try normal parsing
    return JSON.parse(str);
  } catch (error) {
    console.log('Initial JSON parse failed, attempting to fix common issues...');
    
    try {
      // Try to fix common JSON issues
      let fixedStr = str;
      
      // Fix missing closing brackets
      if (str.includes('"Attachments": [') && !str.includes(']')) {
        fixedStr = str + ']';
      }
      
      // Fix missing closing braces
      if (str.includes('{') && !str.includes('}')) {
        fixedStr = str + '}';
      }
      
      // Try parsing the fixed string
      return JSON.parse(fixedStr);
    } catch (fixError) {
      console.error('Failed to fix JSON:', fixError);
      throw new Error('Invalid JSON payload');
    }
  }
}

export async function POST(request) {
  try {
    // Get raw body as text
    const rawBody = await request.text();
    console.log('Received raw body:', rawBody.substring(0, 200) + '...'); // Log first 200 chars
    
    let data;
    try {
      data = safeJsonParse(rawBody);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON payload', details: parseError.message },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['From', 'To', 'Subject', 'TextBody', 'HtmlBody', 'Date'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Extract required fields
    const email = {
      id: Date.now().toString(),
      from: data.From,
      to: data.To,
      subject: data.Subject,
      text: data.TextBody,
      html: data.HtmlBody,
      date: data.Date,
      status: detectStatus(data.Subject, data.TextBody)
    };

    // Ensure data directory exists
    await ensureDataDirectory();

    // Read existing emails or create new array
    const filePath = path.join(process.cwd(), 'src', 'data', 'emails.json');
    let emails = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      emails = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      console.log('Creating new emails.json file');
    }

    // Add new email
    emails.push(email);

    // Save updated emails
    await fs.writeFile(filePath, JSON.stringify(emails, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing inbound email:', error);
    return NextResponse.json(
      { error: 'Failed to process email', details: error.message },
      { status: 500 }
    );
  }
} 