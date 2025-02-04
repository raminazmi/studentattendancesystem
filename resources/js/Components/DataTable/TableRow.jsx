import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { translations } from '../../translations';

export default function TableRow({
    row,
    columns,
    selectable,
    actions,
    selected,
    onSelect,
    onEdit,
    onDelete,
    customActions,
}) {
    const isDark = useSelector((state) => state.theme.darkMode === "dark");
    const language = useSelector((state) => state.language.current);
    const [showActions, setShowActions] = useState(false);
    const t = translations[language];
    const actionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionsRef.current && !actionsRef.current.contains(event.target)) {
                setShowActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const renderActions = () => {
        const actionItems = [];

        if (customActions) {
            actionItems.push(
                <button
                    key="custom"
                    onClick={() => {
                        customActions(row);
                        setShowActions(false);
                    }}
                    className={`block w-full ${language === 'en' ? 'text-left' : 'text-right'
                        } px-4 py-2 text-sm ${isDark ? 'hover:bg-DarkBG3' : 'hover:bg-LightBG3'
                        }`}
                >
                    {t['mark_attendance']}
                </button>
            );
        }

        if (onEdit) {
            actionItems.push(
                <button
                    key="edit"
                    onClick={() => {
                        onEdit(row);
                        setShowActions(false);
                    }}
                    className={`block w-full ${language === 'en' ? 'text-left' : 'text-right'
                        } px-4 py-2 text-sm ${isDark ? 'hover:bg-DarkBG3' : 'hover:bg-LightBG3'
                        }`}
                >
                    {t['edit']}
                </button>
            );
        }

        if (onDelete) {
            actionItems.push(
                <button
                    key="delete"
                    onClick={() => {
                        onDelete(row);
                        setShowActions(false);
                    }}
                    className={`block w-full ${language === 'en' ? 'text-left' : 'text-right'
                        } px-4 py-2 text-sm text-red-500 ${isDark ? 'hover:bg-DarkBG3' : 'hover:bg-LightBG3'
                        }`}
                >
                    {t['delete']}
                </button>
            );
        }



        return actionItems.length > 0 ? (
            <div
                className={`absolute ${language === 'en' ? 'right-6' : 'left-6'
                    } mt-2 w-36 rounded-md shadow-lg ring-1 ring-opacity-5 z-10 ${isDark ? 'bg-DarkBG1 ring-LightBG3' : 'bg-LightBG1 ring-LightBG3'
                    }`}
            >
                <div className="py-1">{actionItems}</div>
            </div>
        ) : null;
    };

    return (
        <tr
            className={`${selected
                ? isDark
                    ? `bg-DarkBG3 border-primaryColor ${language === "en" ? 'border-l-2' : 'border-r-2'
                    }`
                    : `bg-LightBG2 border-primaryColor ${language === "en" ? 'border-l-2' : 'border-r-2'
                    }`
                : ''
                } ${isDark ? 'text-TextLight hover:bg-DarkBG3' : 'text-TextDark hover:bg-LightBG3'
                } transition-colors`}
        >
            {selectable && (
                <td className="relative px-6 py-4">
                    <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-DarkBG3 text-primaryColor focus:ring-primaryColor"
                        checked={selected}
                        onChange={onSelect}
                    />
                </td>
            )}
            {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                </td>
            ))}
            {(actions || customActions) && (
                <td
                    className={`px-6 py-4 ${language === 'en' ? 'text-right' : 'text-left'
                        } whitespace-nowrap text-sm font-medium`}
                >
                    <div className="relative" ref={actionsRef}>
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className={`p-2 rounded-full ${isDark ? 'hover:bg-DarkBG2' : 'hover:bg-LightBG2'
                                } ${showActions
                                    ? isDark
                                        ? 'bg-DarkBG2'
                                        : 'bg-LightBG2'
                                    : ''
                                }`}
                        >
                            <EllipsisVerticalIcon className="h-5 w-5 text-IconColor" />
                        </button>
                        {showActions && renderActions()}
                    </div>
                </td>
            )}
        </tr>
    );
}
