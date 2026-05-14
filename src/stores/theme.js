import { defineStore } from "pinia"
import { ref } from "vue"

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(localStorage.getItem("theme") !== "light")

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem("theme", isDark.value ? "dark" : "light")
    applyTheme()
  }

  applyTheme()

  return { isDark, toggleTheme, applyTheme }
})
