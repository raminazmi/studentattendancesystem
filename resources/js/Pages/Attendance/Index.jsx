import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useSelector } from "react-redux";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Sidebar from '@/Components/Sidebar';
import Breadcrumb from '@/Components/Breadcrumb';
import DataTable from '@/Components/DataTable/DataTable';
import { translations } from '../../translations';
import { formatDate } from '@/utils/dateUtils';
import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function AttendancePage({ auth, attendances }) {
    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const language = useSelector((state) => state.language.current);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const t = translations[language];
    const breadcrumbItems = [
        { label: t['attendance'], href: '/dashboard/attendance' },
        { label: t['list'] }
    ];
    const columns = [
        { key: 'student_name', label: t['student_name'], sortable: true },
        { key: 'class_name', label: t['class'], sortable: true },
        { key: 'date', label: t['date'], sortable: true },
        {
            key: 'status',
            label: t['status'],
            render: (value) => {
                const statusColors = {
                    present: 'bg-green-100 text-green-800',
                    absent: 'bg-red-100 text-red-800',
                    unknown: 'bg-yellow-100 text-yellow-800',
                };

                return (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[value] || statusColors['unknown']}`}>
                        {t[value] || value}
                    </span>
                );
            }
        },
        { key: 'notes', label: t['notes'], sortable: true },
    ];

    const tableData = attendances.data.map(attendance => ({
        id: attendance.id,
        student_name: attendance.student?.name || 'N/A',  // Safe access
        class_name: `${attendance.class.name} - ${attendance.class.section}`,
        date: formatDate(attendance.date),
        status: attendance.status,
        notes: attendance.notes || '-'
    }));

    const handleEdit = (row) => {
        router.get(`/dashboard/attendance/${row.id}/edit`);
    };


    const handleDelete = (row) => {
        setSelectedAttendance(row);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(`/dashboard/attendance/${selectedAttendance.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedAttendance(null);
            }
        });
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedAttendance(null);
    };

    const handleExport = (format) => {
        console.log(`Exporting report as ${format}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t['attendance']} />
            <div className="flex" style={{ height: "calc(100vh - 66px)" }}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-14">
                            <Breadcrumb items={breadcrumbItems} />
                            <div className='flex justify-between items-center'>
                                <h1 className={`text-3xl mt-3 font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                                    {t['attendance']}
                                </h1>
                                <PrimaryButton children={t['add_attendance']} link="/dashboard/attendance/add-new-attendance" />
                            </div>
                        </div>
                        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
                            <DataTable
                                columns={columns}
                                data={tableData}
                                searchable={true}
                                filterable={true}
                                selectable={true}
                                actions={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                </main>
            </div>

            <Modal show={showDeleteModal} onClose={cancelDelete}>
                <div className="p-6">
                    <h2 className={`text-lg font-medium ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                        {t['confirm_delete']}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {t['delete_attendance_confirmation']}
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <SecondaryButton onClick={cancelDelete} className='mx-2 bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'>
                            {t['cancel']}
                        </SecondaryButton>
                        <DangerButton onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                            {t['delete']}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}