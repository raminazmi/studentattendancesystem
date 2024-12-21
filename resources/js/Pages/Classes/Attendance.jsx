import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Sidebar from '@/Components/Sidebar';
import Breadcrumb from '@/Components/Breadcrumb';
import DataTable from '@/Components/DataTable/DataTable';
import AttendanceHeader from '@/Components/Attendance/AttendanceHeader';
import AttendanceButtons from '@/Components/Attendance/AttendanceButtons';
import Modal from '@/Components/Modal';
import useAttendance from '@/hooks/useAttendance';
import { translations } from '../../translations';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AttendancePage({ auth, classroom, students }) {
    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const language = useSelector((state) => state.language.current);
    const t = translations[language];

    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { attendance, handleAttendanceChange, resetAttendance } = useAttendance(students);

    const handleSubmit = async () => {
        const incompleteAttendance = students.some(
            (student) => !attendance[student.id]
        );

        if (incompleteAttendance) {
            setError(t.please_fill_all_attendance);
            setShowModal(true);
            return;
        }

        setError(null);
        setShowModal(true);
    };

    const confirmSave = async () => {
        try {
            setIsSubmitting(true);
            const response = await axios.post(`/dashboard/classes/${classroom.id}/save-attendance`, {
                attendance: attendance,
            });

            if (response.data.message) {
                setShowModal(false);
                toast.success(t.attendance_saved_successfully, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error saving attendance:", error);
            toast.error(error.response?.data?.message || t.attendance_save_failed, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        { key: 'student_name', label: t.student_name, sortable: false },
        {
            key: 'attendance_status',
            label: t.attendance_status,
            render: (_, row) => (
                <AttendanceButtons
                    studentId={row.id}
                    currentStatus={attendance[row.id]}
                    onChange={handleAttendanceChange}
                    translations={t}
                />
            ),
        },
    ];

    const tableData = students.map(student => ({
        id: student.id,
        student_name: student.name,
        attendance_status: attendance[student.id],
    }));

    const breadcrumbItems = [
        { label: t.classroom_management, href: '/dashboard/classes' },
        { label: classroom.name },
        { label: t.attendance },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex" style={{ height: "calc(100vh - 66px)" }}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-14">
                            <Breadcrumb items={breadcrumbItems} />
                            <AttendanceHeader
                                title={t.attendance}
                                onReset={resetAttendance}
                                onSave={handleSubmit}
                                translations={t}
                                isDark={isDark}
                            />
                        </div>
                        <div className="mx-auto px-4 sm:px-6 md:px-14 mt-6">
                            <DataTable
                                columns={columns}
                                data={tableData}
                                selectable={false}
                                searchable={false}
                                filterable={false}
                                actions={false}
                            />
                        </div>
                    </div>
                </main>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h2 className={`text-lg font-medium ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                        {error ? t.error : t.confirm_save_attendance}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {error || t.confirm_save_attendance_message}
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            onClick={() => setShowModal(false)}
                            disabled={isSubmitting}
                        >
                            {t.cancel}
                        </button>
                        {!error && (
                            <button
                                type="button"
                                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                onClick={confirmSave}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t.saving : t.save}
                            </button>
                        )}
                    </div>
                </div>
            </Modal>

            <ToastContainer />
        </AuthenticatedLayout>
    );
}
