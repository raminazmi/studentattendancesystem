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

export default function AddClassPage({ auth, teachers }) {
    const { errors: serverErrors } = usePage().props;
    const [form, setForm] = useState({
        name: '',
        section: '',
        teacher_id: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({...errors, [name]: ''});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationErrors = {};
        if (!form.name) validationErrors.name = 'حقل الاسم مطلوب';
        if (!form.section) validationErrors.section = 'حقل القسم مطلوب';
        if (!form.teacher_id) validationErrors.teacher_id = 'حقل المدرس مطلوب';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        Inertia.post('/dashboard/classes', form, {
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
        { label: t['classroom_management'], href: '/dashboard/classes' },
        { label: t['add_class'] }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t['add_class']} />
            <div className="flex" style={{ height: "calc(100vh - 66px)" }}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-14">
                            <Breadcrumb items={breadcrumbItems} />
                            <h1 className={`text-3xl mt-3 font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                                {t['add_class']}
                            </h1>
                        </div>
                        <div className="mx-auto px-4 sm:px-6 md:px-16 mt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className='flex justify-between gap-6'>
                                        <div className='w-full'>
                                            <InputLabel value={t['class_name']} />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                className={`mt-1 block w-full ${isDark ? 'bg-DarkBG1' : 'bg-TextLight'}`}
                                                value={form.name}
                                                onChange={handleChange}
                                            />
                                            {errors.name && <InputError message={errors.name} className="mt-2" />}
                                        </div>
                                        <div className='w-full'>
                                            <InputLabel value={t['section']} />
                                            <TextInput
                                                id="section"
                                                type="text"
                                                name="section"
                                                className={`mt-1 block w-full ${isDark ? 'bg-DarkBG1' : 'bg-TextLight'}`}
                                                value={form.section}
                                                onChange={handleChange}
                                            />
                                            {errors.section && <InputError message={errors.section} className="mt-2" />}
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel value={t['select_teacher']} />
                                        <select
                                            id="teacher_id"
                                            name="teacher_id"
                                            className={`appearance-none mt-1 shadow-sm focus:border-primaryColor focus:ring-primaryColor h-[45px] mt-3 block w-full p-2 border-none rounded ${isDark ? 'bg-DarkBG1 text-TextLight' : 'bg-TextLight text-TextDark'}`}
                                            value={form.teacher_id}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>{t['select_teacher']}</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.teacher_id && <InputError message={errors.teacher_id} className="mt-2" />}
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
