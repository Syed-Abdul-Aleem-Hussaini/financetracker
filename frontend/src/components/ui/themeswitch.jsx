import React, { useState, useEffect } from 'react'
import useStore from '../../store/index'
import { IoMoonOutline } from "react-icons/io5";
import { LuSunMoon } from "react-icons/lu";

const ThemeSwitch = () => {
    const { theme, setTheme } = useStore(state => state)
    const [isDarkMode, setIsDarkMode] = useState(theme === "dark")

    useEffect(() => {
        // Initialize theme from localStorage if available
        const savedTheme = localStorage.getItem("theme") || "light"
        setTheme(savedTheme)
        setIsDarkMode(savedTheme === "dark")
        // Apply theme to HTML element
        document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }, [])

    const toggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark"
        setIsDarkMode(!isDarkMode)
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        // Toggle dark class on HTML element
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    return (
        <button 
            onClick={toggleTheme} 
            className="outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
            {isDarkMode ? (
                <LuSunMoon size={24} className="text-gray-500 dark:text-gray-400" />
            ) : (
                <IoMoonOutline size={24} className="text-gray-700" />
            )}
        </button>
    )
}

export default ThemeSwitch
