import { forwardRef, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";

export default forwardRef(function TextInput({ type = 'text', value, className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();
    const isDark = useSelector((state) => state.theme.darkMode === "dark");

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            value={value}
            className={
                ` focus:border-primaryColor focus:ring-primaryColor rounded-md shadow-sm border-none h-[45px] mt-3 ` +
                `${isDark ? 'bg-DarkBG1 text-TextLight' : 'bg-LightBG2 text-TextDark border-gray-400 border-[0.1px]' } ` +
                className
            }
            ref={input}
        />
    );
});
