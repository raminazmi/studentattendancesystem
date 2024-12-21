import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Calendar } from 'lucide-react';
import { useSelector } from "react-redux";
import { translations } from '../../translations';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AttendanceChart({ data }) {
    const language = useSelector((state) => state.language.current);
    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const t = translations[language];

 // إعداد البيانات للمخطط
const chartData = {
    labels: data.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
        label: t['present'],
        data: data.present || [10, 20, 30, 40, 50],  // بيانات الحضور
        backgroundColor: 'rgba(76, 175, 80, 0.6)',  // لون أخضر خفيف
        borderColor: 'rgba(76, 175, 80, 1)',  // حدود باللون الأخضر
        borderWidth: 1,
    },
    {
        label: t['absent'],
        data: data.absent || [5, 10, 15, 20, 25],  // بيانات الغياب
        backgroundColor: 'rgba(244, 67, 54, 0.6)',  // لون أحمر خفيف
        borderColor: 'rgba(244, 67, 54, 1)',  // حدود باللون الأحمر
        borderWidth: 1,
    },
    {
        label: t['late'],
        data: data.late || [1, 2, 3, 4, 5],  // بيانات التأخير
        backgroundColor: 'rgba(255, 193, 7, 0.6)',  // لون أصفر خفيف
        borderColor: 'rgba(255, 193, 7, 1)',  // حدود باللون الأصفر
        borderWidth: 1,
    },
]

};

// إعداد الخيارات للمخطط
const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                color: isDark ? '#fff' : '#000',  // تغيير اللون بناءً على وضع السمة
            },
        },
        title: {
            display: true,
            text: t['attendance_chart'],  // عنوان المخطط
            color: isDark ? '#fff' : '#000',  // تغيير اللون بناءً على وضع السمة
        },
    },
    scales: {
        x: {
            ticks: {
                color: isDark ? '#fff' : '#000',  // تغيير اللون بناءً على وضع السمة
            },
        },
        y: {
            ticks: {
                color: isDark ? '#fff' : '#000',  // تغيير اللون بناءً على وضع السمة
            },
        },
    },
};


    return (
        <div className={`${isDark ? 'bg-DarkBG1 text-TextLight' : 'bg-LightBG1 text-TextDark'} rounded-lg p-4 shadow-sm`}>
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" />
                <h3 className="font-semibold">{t['attendance_chart']}</h3>
            </div>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
}
