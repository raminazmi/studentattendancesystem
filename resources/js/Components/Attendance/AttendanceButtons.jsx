import React, { useState } from 'react';

export default function AttendanceButtons({ studentId, currentStatus, onChange, translations }) {
    const statuses = [
        { value: 'present', colorClass: 'bg-green-500 hover:bg-green-600' },
        { value: 'absent', colorClass: 'bg-red-500 hover:bg-red-600' },
        { value: 'late', colorClass: 'bg-yellow-500 hover:bg-yellow-600' }
    ];

    const [lateTime, setLateTime] = useState('');

    const handleStatusChange = (status) => {
        onChange(studentId, status === 'late' ? { status, lateTime } : status);
    };

    const handleLateTimeChange = (e) => {
        setLateTime(e.target.value);
        onChange(studentId, { status: 'late', lateTime: e.target.value });
    };

    const getButtonClass = (statusValue) => {
        const isSelected = typeof currentStatus === 'object'
            ? currentStatus.status === statusValue
            : currentStatus === statusValue;

        const status = statuses.find(s => s.value === statusValue);

        return `px-3 py-1 rounded transition-colors ${isSelected
                ? status.colorClass + ' text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`;
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-4">
                {statuses.map(({ value }) => (
                    <button
                        key={value}
                        className={getButtonClass(value)}
                        onClick={() => handleStatusChange(value)}
                    >
                        {translations[value]}
                    </button>
                ))}
            </div>
            {(typeof currentStatus === 'object' && currentStatus?.status === 'late') && (
                <input
                    type="time"
                    placeholder={translations.enter_late_time}
                    value={lateTime}
                    onChange={handleLateTimeChange}
                    className="mt-2 px-3 py-1 border rounded"
                />
            )}
        </div>
    );
}
