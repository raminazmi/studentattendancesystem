import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useSelector } from "react-redux";
import { translations } from '../translations';

export default function Guest({ children }) {
    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const language = useSelector((state) => state.language.current);
    const t = translations[language];
    return (
        <div className={`min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 ${isDark ? 'bg-DarkBG1' : 'bg-LightBG2'} `}  dir={language === 'ar' ? 'rtl' : 'ltr'}>


            <div className={`w-full sm:max-w-md mt-6 px-6 py-4 shadow-md overflow-hidden sm:rounded-lg ${isDark ? 'bg-DarkBG3' : 'bg-LightBG1'}`} >
                            <div className='flex justify-center'>
                <Link href="/">
                    <ApplicationLogo width="80px" />
                </Link>
                </div>
                <h1 className={`text-center mb-6 text-[20px] font-bold ${isDark ? 'text-TextLight' : 'text-TextDark'} `}>{t['MZ']}</h1>
                {children}
            </div>
        </div>
    );
}
