"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EmailTestPage() {
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('אלכס');
  const [loading, setLoading] = useState(false);
  
  const sendTestEmail = async () => {
    if (!email) {
      setStatus('Error: יש להזין כתובת אימייל');
      return;
    }
    
    setLoading(true);
    setStatus('שולח אימייל...');
    
    try {
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          userName
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('האימייל נשלח בהצלחה!');
      } else {
        setStatus(`שגיאה: ${data.error || 'שליחת האימייל נכשלה'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus(`שגיאה: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8 max-w-md mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">בדיקת שליחת אימייל</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">כתובת אימייל</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="example@example.com"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">שם משתמש</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <Button 
        onClick={sendTestEmail}
        disabled={loading}
        className="w-full mb-4"
      >
        {loading ? 'שולח...' : 'שלח אימייל בדיקה'}
      </Button>
      
      {status && (
        <div className={`p-4 rounded-md ${status.includes('שגיאה') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {status}
        </div>
      )}
    </div>
  );
}
