import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useSelector } from "react-redux";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Sidebar from '@/Components/Sidebar';
import Breadcrumb from '@/Components/Breadcrumb';
import DataTable from '@/Components/DataTable/DataTable';
import { translations } from '../../translations';
import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ClassesPage({ auth, classes }) {
    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const language = useSelector((state) => state.language.current);
    const t = translations[language];
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const breadcrumbItems = [
        { label: t['classroom_management'], href: '/dashboard/classes' },
        { label: t['list'] }
    ];
    const columns = [
        { key: 'class_name', label: t['class_name'], sortable: true },
        { key: 'teacher_name', label: t['teacher_name'], sortable: true },
        { key: 'section', label: t['section'], sortable: true },
    ];

    const tableData = classes.data.map(classItem => ({
        id: classItem.id,
        class_name: classItem.name,
        teacher_name: classItem.teacher ? classItem.teacher.name : 'N/A',
        section: classItem.section,
    }));

    const handleEdit = (row) => {
        router.get(`/dashboard/classes/${row.id}/edit`);
    };

    const handleAttendance = (row) => {
        router.get(`/dashboard/classes/${row.id}/attendance`);
    };

    const handleDelete = (row) => {
        setSelectedClass(row);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(`/dashboard/classes/${selectedClass.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedClass(null);
            }
        });
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedClass(null);
    };

    const handleExport = (format) => {
        console.log(`Exporting report as ${format}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t['classes']} />
            <div className="flex" style={{ height: "calc(100vh - 66px)" }}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-14">
                            <Breadcrumb items={breadcrumbItems} />
                            <div className='flex justify-between items-center'>
                                <h1 className={`text-3xl mt-3 font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                                    {t['classes']}
                                </h1>
                                <PrimaryButton children={t['add_class']} link="/dashboard/classes/add-new-class" />
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
                                customActions={handleAttendance}
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
                        {t['delete_class_confirmation']}
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