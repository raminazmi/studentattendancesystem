import React from 'react';
import PrimaryButton from '../PrimaryButton';

export default function AttendanceHeader({ title, onReset, onSave, translations, isDark }) {
    return (
        <div className="flex justify-between items-center">
            <h1 className={`text-3xl mt-3 font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'
                }`}>
                {title}
            </h1>
            <div className="flex gap-4">
                <PrimaryButton
                    onClick={onReset}
                    className="bg-gray-500 hover:bg-gray-600"
                >
                    {translations.reset_attendance}
                </PrimaryButton>
                <PrimaryButton onClick={onSave}>
                    {translations.save_attendance}
                </PrimaryButton>
            </div>
        </div>
    );
}