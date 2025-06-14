import React, { useState } from 'react'
import useStore from '../../store/index'

const ThemeSwitch = () => {
    const {theme, setTheme}  = useStore(state => state)
    const [isDarkMode, setIsDarkMode]   = useState (theme === "dark")


    const toggleTheme  = () => {
        const newTheme  = isDarkMode ? "light" :"dark";
        setIsDarkMode(!isDarkMode)

        setTheme(newTheme);
        localStorage.setItem("theme",newTheme)

    }
  return (
    <div>
      theme seit
    </div>
  )
}

export default ThemeSwitch
