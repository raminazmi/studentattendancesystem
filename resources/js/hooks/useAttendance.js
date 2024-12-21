import { useState, useEffect } from 'react';

export default function useAttendance(students) {
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        const initialAttendance = {};
        students.forEach((student) => {
            initialAttendance[student.id] = ''; // Initialize empty status for each student
        });
        setAttendance(initialAttendance);
    }, [students]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const resetAttendance = () => {
        const reset = {};
        students.forEach(student => {
            reset[student.id] = '';
        });
        setAttendance(reset);
    };

    return {
        attendance,
        handleAttendanceChange,
        resetAttendance
    };
}