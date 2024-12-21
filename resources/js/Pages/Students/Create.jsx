import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Sidebar from '@/Components/Sidebar';
import Breadcrumb from '@/Components/Breadcrumb';
import PrimaryButton from '@/Components/PrimaryButton';
import { translations } from '../../translations';
import { useSelector } from 'react-redux';
import { Inertia } from '@inertiajs/inertia';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function AddStudentPage({ auth, classes }) {
    const { errors: serverErrors } = usePage().props;
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        class_id: '',
        parent_whatsapp: '',
        cycle: 'general',  // تعيين قيمة افتراضية
        grades: 0,  // تعيين قيمة افتراضية
        path: 'general',  // تعيين قيمة افتراضية
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationErrors = {};
        if (!form.name) validationErrors.name = 'حقل الاسم مطلوب';
        if (!form.email) validationErrors.email = 'حقل البريد الإلكتروني مطلوب';
        if (!form.phone) validationErrors.phone = 'حقل الهاتف مطلوب';
        if (!form.class_id) validationErrors.class_id = 'حقل الصف مطلوب';
        if (!form.parent_whatsapp) validationErrors.parent_whatsapp = 'حقل واتساب ولي الأمر مطلوب';
        if (!form.cycle) validationErrors.cycle = 'حقل الدورة مطلوب';
        if (form.grades === null || form.grades === '') validationErrors.grades = 'حقل الدرجات مطلوب';
        if (!form.path) validationErrors.path = 'حقل المسار مطلوب'; 

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        Inertia.post('/dashboard/students', form, {
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
        { label: t['student_management'], href: '/dashboard/students' },
        { label: t['add_student'] }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t['add_student']} />
            <div className="flex" style={{ height: "calc(100vh - 66px)" }}>
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto px-4 sm:px-6 md:px-14">
                            <Breadcrumb items={breadcrumbItems} />
                            <h1 className={`text-3xl mt-3 font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'}`}>
                                {t['add_student']}
                            </h1>
                        </div>
                        <div className="mx-auto px-4 sm:px-6 md:px-16 mt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className='flex justify-between gap-6'>
                                        <div className='w-full'>
                                            <InputLabel value={t['student_name']} />
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
                                    <div className='flex justify-between gap-6'>
                                        <div className='w-full'>
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
                                        <div className='w-full'>
                                            <InputLabel value={t['select_class']} />
                                            <select
                                                id="class_id"
                                                name="class_id"
                                                className={`appearance-none mt-1 shadow-sm focus:border-primaryColor focus:ring-primaryColor h-[45px] mt-3 block w-full p-2 border-none rounded ${isDark ? 'bg-DarkBG1 text-TextLight' : 'bg-TextLight text-TextDark'}`}
                                                value={form.class_id}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>{t['select_class']}</option>
                                                {classes.map((classItem) => (
                                                    <option key={classItem.id} value={classItem.id}>
                                                        {classItem.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.class_id && <InputError message={errors.class_id} className="mt-2" />}
                                        </div>
                                    </div>
                                    <div className='flex justify-between gap-6'>
                                        <div className='w-full'>
                                            <InputLabel value={t['cycle']} />
                                            <input
                                                id="cycle"
                                                name="cycle"
                                                type="number"
                                                className={`mt-1 block w-full ${isDark ? 'bg-DarkBG1' : 'bg-TextLight'}`}
                                                value={form.cycle}
                                                onChange={handleChange}
                                            />
                                            {errors.cycle && <InputError message={errors.cycle} className="mt-2" />}
                                        </div>
                                        <div className='w-full'>
                                            <InputLabel value={t['grades']} />
                                            <input
                                                id="grades"
                                                name="grades"
                                                type="number"
                                                className={`mt-1 block w-full ${isDark ? 'bg-DarkBG1' : 'bg-TextLight'}`}
                                                value={form.grades}
                                                onChange={handleChange}
                                            />
                                            {errors.grades && <InputError message={errors.grades} className="mt-2" />}
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel value={t['path']} />
                                        <select
                                            id="path"
                                            name="path"
                                            className={`appearance-none mt-1 shadow-sm focus:border-primaryColor focus:ring-primaryColor h-[45px] mt-3 block w-full p-2 border-none rounded ${isDark ? 'bg-DarkBG1 text-TextLight' : 'bg-TextLight text-TextDark'}`}
                                            value={form.path}
                                            onChange={handleChange}
                                        >
                                            <option value="general">{t['general']}</option>
                                            <option value="advanced">{t['advanced']}</option>
                                        </select>
                                        {errors.path && <InputError message={errors.path} className="mt-2" />}
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
