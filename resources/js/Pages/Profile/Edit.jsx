import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { useSelector } from "react-redux";
import { translations } from '../../translations';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const language = useSelector((state) => state.language.current);
    const t = translations[language];
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title={t['profile']} />
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <h1 className="text-2xl font-semibold text-gray-900">{t['profile']}</h1>
                        </div>
                        <div className="py-12">
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className=""
                                    />
                                </div>

                                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                    <UpdatePasswordForm className="" />
                                </div>

                                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                    <DeleteUserForm className="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}
