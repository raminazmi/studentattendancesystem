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

export default function StudentsPage({ auth, students, classes }) {
    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const language = useSelector((state) => state.language.current);
    const t = translations[language];
    const breadcrumbItems = [
        { label: t['student_management'], href: '/dashboard/students' },
        { label: t['list'] }
    ];

    const columns = [
        { key: 'student_name', label: t['student_name'], sortable: true },
        { key: 'email', label: t['email'], sortable: true },
        { key: 'class_name', label: t['class_name'], sortable: true },
        { key: 'phone', label: t['phone'], sortable: true },
        { key: 'parent_whatsapp', label: t['parent_whatsapp'], sortable: true },
        { key: 'cycle', label: t['cycle'], sortable: true },  // إضافة عمود cycle
        { key: 'grades', label: t['grades'], sortable: true },  // إضافة عمود grades
        { key: 'path', label: t['path'], sortable: true },  // إضافة عمود path
    ];

    const tableData = students.data.map(student => {
        const classItem = classes.find(cls => cls.id === student.class_id);
        return {
            id: student.id,
            student_name: student.name,
            email: student.email,
            class_name: classItem ? classItem.name : 'N/A',
            phone: student.phone,
            parent_whatsapp: student.parent_whatsapp,
            cycle: student.cycle,
            grades: student.grades,
            path: student.path,
        };
    });

    const handleEdit = (row) => {
        router.get(`/dashboard/students/${row.id}/edit`);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleDelete = (row) => {
        setSelectedStudent(row);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(`/dashboard/students/${selectedStudent.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedStudent(null);
            }
        });
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedStudent(null);
    };

    const handleExport = (format) => {
        console.log(`Exporting report as ${format}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t['students']} />
            <div className="flex" style={{ height: "calc(100vh - 66px)" }}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-14">
                            <Breadcrumb items={breadcrumbItems} />
                            <div className='flex justify-between items-center'>
                                <h1 className={`text-3xl mt-3 font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                                    {t['students']}
                                </h1>
                                <PrimaryButton children={t['add_student']} link="/dashboard/students/add-new-student" />
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
                        {t['delete_student_confirmation']}
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
