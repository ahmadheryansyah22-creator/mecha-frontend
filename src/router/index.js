import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue'), meta: { guest: true } },
    { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue'), meta: { guest: true } },
    { path: '/pilih-role', name: 'pilih-role', component: () => import('../views/auth/RoleSelectView.vue'), meta: { requiresAuth: true } },
    {
      path: '/',
      component: () => import('../views/layouts/MainLayout.vue'),
      meta: { requiresAuth: true, role: ['bengkel'] },
      children: [
        { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'bengkel', name: 'bengkel', component: () => import('../views/BengkelView.vue') },
        { path: 'kendaraan', name: 'kendaraan', component: () => import('../views/VehicleView.vue') },
        { path: 'daftar-mekanik', name: 'daftar-mekanik', component: () => import('../views/MechanicView.vue') },
        { path: 'order', name: 'order', component: () => import('../views/OrderView.vue') },
        { path: 'transaksi', name: 'transaksi', component: () => import('../views/TransactionView.vue') },
        { path: 'sparepart', name: 'sparepart', component: () => import('../views/SparePartView.vue') },
        { path: 'ai-diagnostic', name: 'ai-diagnostic', component: () => import('../views/AiDiagnosticView.vue') },
        { path: 'profil', name: 'profil', component: () => import('../views/ProfileView.vue') },
      ]
    },
    {
      path: '/portal-mekanik',
      component: () => import('../views/mekanik/MekanikLayout.vue'),
      meta: { requiresAuth: true, role: ['mekanik'] },
      children: [
        { path: '', name: 'mekanik-dashboard', component: () => import('../views/mekanik/MekanikDashboard.vue') },
        { path: 'order', name: 'mekanik-order', component: () => import('../views/mekanik/MekanikOrder.vue') },
        { path: 'kendaraan', name: 'mekanik-kendaraan', component: () => import('../views/mekanik/MekanikVehicle.vue') },
        { path: 'penghasilan', name: 'mekanik-penghasilan', component: () => import('../views/mekanik/MekanikEarnings.vue') },
        { path: 'ai-diagnostic', name: 'mekanik-ai-diagnostic', component: () => import('../views/mekanik/MekanikAiDiagnostic.vue') },
        { path: 'profil', name: 'mekanik-profil', component: () => import('../views/mekanik/MekanikProfile.vue') },
      ]
    },
    {
      path: '/customer',
      component: () => import('../views/customer/CustomerLayout.vue'),
      meta: { requiresAuth: true, role: ['customer'] },
      children: [
        { path: '', name: 'customer-home', component: () => import('../views/customer/CustomerHome.vue') },
        { path: 'bengkel', name: 'customer-bengkel', component: () => import('../views/customer/CustomerBengkel.vue') },
        { path: 'order', name: 'customer-order', component: () => import('../views/customer/CustomerOrder.vue') },
        { path: 'ai-diagnostic', name: 'customer-ai-diagnostic', component: () => import('../views/customer/CustomerAiDiagnostic.vue') },
        { path: 'profil', name: 'customer-profil', component: () => import('../views/customer/CustomerProfile.vue') },
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user.role || 'customer'
  if (to.meta.requiresAuth && !token) return next('/login')
  if (to.meta.guest && token) {
    if (role === 'customer') return next('/customer')
    if (role === 'mekanik') return next('/portal-mekanik')
    return next('/')
  }
  if (to.meta.role && !to.meta.role.includes(role)) {
    if (role === 'customer') return next('/customer')
    if (role === 'mekanik') return next('/portal-mekanik')
    return next('/')
  }
  return next()
})
export default router
