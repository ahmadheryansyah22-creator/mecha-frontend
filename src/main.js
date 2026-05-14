import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import axios from "axios"
import "./assets/main.css"

axios.defaults.baseURL = "http://localhost:8000"
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount("#app")
