import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { translations } from '../../translations';

export default function TablePagination({
  total,
  perPage,
  currentPage,
  onPageChange,
  onPerPageChange,
}) {
  const isDark = useSelector((state) => state.theme.darkMode === "dark");
  const language = useSelector((state) => state.language.current);
  const t = translations[language];

  const totalPages = Math.ceil(total / perPage);
  const isRTL = language === 'ar';

  return (
    <div className={`flex items-center justify-between px-4 py-3 ${isDark ? 'bg-DarkBG1 text-TextLight divide-DarkBG1' : 'bg-LightBG1 text-TextDark divide-LightBG3'}`}>
      <div className="flex items-center">
        <span className="text-sm">
          {t['showing']} {(currentPage - 1) * perPage + 1} {t['to']} {Math.min(currentPage * perPage, total)} {t['of']} {total} {t['results']}
        </span>
        <select
                  value={perPage}
                  onChange={(e) => onPerPageChange(Number(e.target.value))}
                  className={`mx-2 rounded-md border-[2px] ${isDark ? 'border-DarkBG3 bg-DarkBG3 text-TextLight' : 'border-LightBG3  bg-LightBG1 text-TextDark'} text-sm focus:outline-none focus:ring-primaryColor focus:border-primaryColor`}
        >
          {[5, 10, 25, 50].map((value) => (
            <option key={value} value={value}>
              {value} {t['perPage']} 
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-md hover:bg-DarkBG3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRTL ? (
            <ChevronRightIcon className="h-5 w-5 text-IconColor" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-IconColor" />
          )}
        </button>
        
        <span className="text-sm">
          {t['page']} {currentPage} {t['of']} {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md hover:bg-DarkBG3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRTL ? (
            <ChevronLeftIcon className="h-5 w-5 text-IconColor" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-IconColor" />
          )}
        </button>
      </div>
    </div>
  );
}