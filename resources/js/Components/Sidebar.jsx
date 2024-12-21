import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  ComputerDesktopIcon,
  TagIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
CheckCircleIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { translations } from '../translations';




export default function Sidebar() {
  const isDark = useSelector((state) => state.theme.darkMode === "dark");
  const language = useSelector((state) => state.language.current);
  const t = translations[language];
  const { url } = usePage();
const navigation = [
  { name: t['dashboard'], href: '/dashboard/home', icon: HomeIcon },
  { name: t['attendance'], href: '/dashboard/attendance', icon: CheckCircleIcon },
  { name: t['classroom_management'], href: '/dashboard/classes', icon: ComputerDesktopIcon },
  { name: t['teachers_management'], href: '/dashboard/teachers', icon: PresentationChartLineIcon },
  { name: t['student_management'], href: '/dashboard/students', icon: AcademicCapIcon },
  { name: t['session_and_class_management'], href: '/dashboard/products', icon: CalendarIcon },
];
  return (
    <div className={`flex flex-col ${isDark ? 'bg-DarkBG2' : 'bg-LightBG2'} w-64 border-gray-200 dark:border-gray-700`} style={{ height: "calc(100vh - 66px)" }}>
      <nav className="flex-1 px-2 py-6 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md 
              ${url.startsWith(item.href)
                ? `text-primaryColor font-bold ${isDark ? 'bg-DarkBG1' : 'bg-LightBG3'}`
                : isDark
                  ? `text-TextLight ${isDark ? 'hover:bg-DarkBG1' : 'hover:bg-LightBG3'}`
                  : `text-TextDark ${isDark ? 'hover:bg-DarkBG1' : 'hover:bg-LightBG3'}`
              }`}
          >
            <item.icon
              className={`${language === 'en' ? 'mr-3' : 'ml-3'} h-6 w-6 
              ${url.startsWith(item.href)
                  ? 'text-primaryColor'
                  : 'text-IconColor'
              }`}
              aria-hidden="true"
            />
            {item.name}
          </Link>

        ))}
      </nav>
    </div>
  );
}