import React from 'react';
import { BarChart } from 'lucide-react';
import ExportButton from './ExportButton';
import { useSelector } from "react-redux";
import { translations } from '../../translations';

export default function AttendanceReportHeader({ onExport }) {
  const isDark = useSelector((state) => state.theme.darkMode === "dark");
  const language = useSelector((state) => state.language.current);
  const t = translations[language];
  
  const handleExport = async (format) => {
    try {
      const response = await axios.get(`/dashboard/attendance/export?format=${format}`, {
            responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `attendance_report.${format}`);
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error('خطأ في تصدير التقرير:', error);
    }
};


  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold flex items-center">
        <BarChart className={`w-5 h-5 ${language === 'en' ? 'mr-2' : 'ml-2'}`} />
        {t['attendance_report']}
      </h2>
      <div className="flex gap-2">
<ExportButton onExport={() => handleExport('pdf')} type="pdf" />
<ExportButton onExport={() => handleExport('csv')} type="csv" />
      </div>
    </div>
  );
}