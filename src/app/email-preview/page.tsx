"use client";

import { WelcomeEmail, VercelInviteUserEmail } from '@/components/email/invite';
import { render } from '@react-email/render';
import { useEffect, useState } from 'react';

export default function EmailPreviewPage() {
  const [htmlContent, setHtmlContent] = useState('');
  
  useEffect(() => {
    async function renderEmail() {
      const html = await render(VercelInviteUserEmail({ userName: "אלכס" }));
      setHtmlContent(html);
    }
    renderEmail();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">תצוגה מקדימה של אימייל</h1>
      <div className="border border-gray-300 rounded-lg p-4 max-w-3xl mx-auto">
        <iframe 
          srcDoc={htmlContent}
          width="100%" 
          height="800" 
          title="Email Preview"
          className="border-0"
        />
      </div>
    </div>
  );
}
