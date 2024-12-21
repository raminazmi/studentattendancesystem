import React, { useState } from "react";
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useSelector } from "react-redux";
import ThemeToggle from '@/Components/ThemeToggle';
import LanguageToggle from '@/Components/LanguageToggle';
import { translations } from '../translations';
import { UserCircleIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { props } = usePage();
    const firstLetter = user?.name?.charAt(0).toUpperCase();
    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const language = useSelector((state) => state.language.current);
    const t = translations[language];
    return (
        <div className="h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <nav className={` border-b-[2px] ${isDark ? 'bg-DarkBG1 border-TextDark' : 'bg-LightBG1 border-LightBG3'}`}>
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/dashboard/home">
                                    <ApplicationLogo width="50px" />
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex items-center gap-3 rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-full px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-full text-gray-500 bg-black hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user?.profileImage ? (
                                                    <img
                                                        src={user.profileImage}
                                                        alt="User"
                                                        className="w-full h-full "
                                                    />
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                        {firstLetter}
                                                    </span>
                                                )}
                                            </button>
                                            <div className={`${isDark ? 'text-TextLight' : 'text-TextDark'} cursor-pointer`}>
                                                {user.name.length >= 18 ? `${user.name.slice(0, 18)}...` : user.name}
                                            </div>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href="/dashboard/profile/edit" top={true}>
                                            <div className="flex justify-start items-center">
                                                <UserCircleIcon
                                                    className={`${language === 'en' ? 'mr-3' : 'ml-3'} h-6 w-6 text-IconColor`}
                                                    aria-hidden="true"
                                                />
                                                <p>{t['profile']}</p>
                                            </div>
                                        </Dropdown.Link>
                                        <div className="flex justify-start items-center">
                                            <Dropdown.Link center={true}>
                                                <ThemeToggle />
                                            </Dropdown.Link>
                                            <Dropdown.Link center={true}>
                                                <LanguageToggle />
                                            </Dropdown.Link>
                                        </div>
                                        <Dropdown.Link href="/logout" bottom={true} method="post" as="button">
                                            <div className="flex justify-start items-center">
                                                <ArrowLeftEndOnRectangleIcon
                                                    className={`${language === 'en' ? 'mr-3' : 'ml-3'} h-5 w-5 text-IconColor`}
                                                    aria-hidden="true"
                                                />
                                                <p>{t['logout']}</p>
                                            </div>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href="/dashboard/profile/edit">
                                <div className="flex justify-start items-center">
                                    <UserCircleIcon
                                        className={`${language === 'en' ? 'mr-3' : 'ml-3'} h-6 w-6 text-IconColor`}
                                        aria-hidden="true"
                                    />
                                    <p>{t['profile']}</p>
                                </div>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href="/logout" method="post" as="button">
                                <div className="flex justify-start items-center">
                                    <ArrowLeftEndOnRectangleIcon
                                        className={`${language === 'en' ? 'mr-3' : 'ml-3'} h-6 w-6 text-IconColor`}
                                        aria-hidden="true"
                                    />
                                    <p>{t['logout']}</p>
                                </div>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <div className={`${isDark ? 'bg-DarkBG2' : 'bg-LightBG2'}`}>

                <main>{children}</main>
            </div>
        </div>
    );
}