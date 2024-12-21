import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Sidebar from '@/Components/Sidebar';
import Breadcrumb from '@/Components/Breadcrumb';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { translations } from '../../translations';
import { useSelector } from 'react-redux';
import { Inertia } from '@inertiajs/inertia';

export default function EditAttendancePage({ auth, attendance, students }) {
    const { errors: serverErrors } = usePage().props;
    const [form, setForm] = useState({
        student_id: attendance.student_id || '',
        status: attendance.status || '',
        date: attendance.date || '',
        notes: attendance.notes || ''
    });
    const [errors, setErrors] = useState(serverErrors || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({...errors, [name]: ''});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationErrors = {};
        if (!form.student_id) validationErrors.student_id = 'حقل الطالب مطلوب';
        if (!form.status) validationErrors.status = 'حقل الحالة مطلوب';
        if (!form.date) validationErrors.date = 'حقل التاريخ مطلوب';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        Inertia.put(`/dashboard/attendance/${attendance.id}`, form, {
            onError: (errors) => {
                setErrors(errors);
            },
            preserveScroll: true
        });
    };

    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const language = useSelector((state) => state.language.current);
    const t = translations[language];
    const breadcrumbItems = [
        { label: t['attendance'], href: '/dashboard/attendance' },
        { label: t['edit_attendance'] }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t['edit_attendance']} />
            <div className="flex" style={{ height: "calc(100vh - 66px)" }}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-14">
                            <Breadcrumb items={breadcrumbItems} />
                            <h1 className={`text-3xl mt-3 font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                                {t['edit_attendance']}
                            </h1>
                        </div>
                        <div className="mx-auto px-4 sm:px-6 md:px-16 mt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className='flex justify-between gap-6'>
                                        <div className='w-full'>
                                            <InputLabel value={t['select_student']} />
                                            <select
                                                id="student_id"
                                                name="student_id"
                                                className={`appearance-none mt-1 shadow-sm focus:border-primaryColor focus:ring-primaryColor h-[45px] mt-3 block w-full p-2 border-none rounded ${isDark ? 'bg-DarkBG1 text-TextLight' : 'bg-TextLight text-TextDark'}`}
                                                value={form.student_id}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>{t['select_student']}</option>
                                                {students.map((student) => (
                                                    <option key={student.id} value={student.id}>
                                                        {student.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.student_id && <InputError message={errors.student_id} className="mt-2" />}
                                        </div>
                                        <div className='w-full'>
                                            <InputLabel value={t['status']} />
                                            <select
                                                id="status"
                                                name="status"
                                                className={`appearance-none mt-1 shadow-sm focus:border-primaryColor focus:ring-primaryColor h-[45px] mt-3 block w-full p-2 border-none rounded ${isDark ? 'bg-DarkBG1 text-TextLight' : 'bg-TextLight text-TextDark'}`}
                                                value={form.status}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>{t['select_status']}</option>
                                                <option value="present">{t['present']}</option>
                                                <option value="absent">{t['absent']}</option>
                                                <option value="late">{t['late']}</option>
                                            </select>
                                            {errors.status && <InputError message={errors.status} className="mt-2" />}
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel value={t['date']} />
                                        <TextInput
                                            id="date"
                                            type="date"
                                            name="date"
                                            className={`mt-1 block w-full ${isDark ? 'bg-DarkBG1' : 'bg-TextLight'}`}
                                            value={form.date}
                                            onChange={handleChange}
                                        />
                                        {errors.date && <InputError message={errors.date} className="mt-2" />}
                                    </div>
                                    <div>
                                        <InputLabel value={t['notes']} />
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            className={`mt-1 block w-full rounded-md ${isDark ? 'bg-DarkBG1' : 'bg-TextLight'}`}
                                            value={form.notes}
                                            onChange={handleChange}
                                            rows={4}
                                        />
                                        {errors.notes && <InputError message={errors.notes} className="mt-2" />}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <PrimaryButton>{t['save']}</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
