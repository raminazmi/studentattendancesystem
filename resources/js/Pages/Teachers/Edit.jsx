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

export default function EditTeacherPage({ auth, teacher }) {
    const { errors: serverErrors } = usePage().props;
    const [form, setForm] = useState({
        name: teacher.name || '',
        email: teacher.email || '',
        phone: teacher.phone || ''
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
        if (!form.name) validationErrors.name = 'حقل الاسم مطلوب';
        if (!form.email) validationErrors.email = 'حقل البريد الإلكتروني مطلوب';
        if (!form.phone) validationErrors.phone = 'حقل الهاتف مطلوب';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        Inertia.put(`/dashboard/teachers/${teacher.id}`, form, {
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
        { label: t['teachers_management'], href: '/dashboard/teachers' },
        { label: t['edit_teacher'] }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t['edit_teacher']} />
            <div className="flex" style={{ height: "calc(100vh - 66px)" }}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-14">
                            <Breadcrumb items={breadcrumbItems} />
                            <h1 className={`text-3xl mt-3 font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                                {t['edit_teacher']}
                            </h1>
                        </div>
                        <div className="mx-auto px-4 sm:px-6 md:px-16 mt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className='flex justify-between gap-6'>
                                        <div className='w-full'>
                                            <InputLabel value={t['name']} />
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
                                            <InputLabel value={t['email']} />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                className={`mt-1 block w-full ${isDark ? 'bg-DarkBG1' : 'bg-TextLight'}`}
                                                value={form.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email && <InputError message={errors.email} className="mt-2" />}
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel value={t['phone']} />
                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            className={`mt-1 block w-full ${isDark ? 'bg-DarkBG1' : 'bg-TextLight'}`}
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                        {errors.phone && <InputError message={errors.phone} className="mt-2" />}
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
