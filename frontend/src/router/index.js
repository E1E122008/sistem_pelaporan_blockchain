import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AdminLogin from '../views/AdminLogin.vue';
import ReportForm from '../views/ReportForm.vue';
import ReportList from '../views/ReportList.vue';
import VerifyReport from '../views/VerifyReport.vue';
import AccessDenied from '../views/AccessDenied.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin
    },
    {
        path: '/report/new',
        name: 'ReportForm',
        component: ReportForm
    },
    {
        path: '/reports',
        name: 'ReportList',
        component: () => import('../views/ReportList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/verify',
        name: 'VerifyReport',
        component: VerifyReport
    },
    {
        path: '/access-denied',
        name: 'AccessDenied',
        component: AccessDenied
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const walletAddress = localStorage.getItem('walletAddress');
        if (!walletAddress) {
            next({ name: 'AdminLogin' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router; 