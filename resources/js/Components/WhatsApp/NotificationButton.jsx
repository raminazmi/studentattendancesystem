import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MessageCircle } from 'lucide-react';

export default function NotificationButton({ studentId, status }) {
  const { t } = useTranslation();

  const sendNotification = async () => {
    try {
      const response = await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, status }),
      });
      
      if (!response.ok) throw new Error('Failed to send notification');
      
      // Show success message
    } catch (error) {
      console.error('Error sending notification:', error);
      // Show error message
    }
  };

  return (
    <button
      onClick={sendNotification}
      className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
    >
      <MessageCircle className="w-4 h-4 mr-1" />
      {t('send_notification')}
    </button>
  );
}