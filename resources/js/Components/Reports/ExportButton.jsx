import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Download } from 'lucide-react';
import axios from 'axios';

export default function ExportButton({ onExport, type = 'pdf' }) {
      const { t } = useTranslation();
  const handleExport = async () => {
        try {
            const response = await axios.get(`/dashboard/attendance/export?format=${type}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_report.${type}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Failed to export ${type.toUpperCase()}:`, error);
        }
    };

    return (
        <button
            onClick={handleExport}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
              <Download className="w-4 h-4 mr-2" />
            {t('export')}  {type.toUpperCase()}
        </button>
    );
}

