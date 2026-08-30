import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
    history: createWebHashHistory(),

    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue")
        },
        {
            path: "/projects",
            name: "projects",
            component: () => import("../views/ProjectsView.vue")
        },
        {
            path: "/posts",
            name: "posts",
            component: () => import("../views/PostsView.vue")
        },
        {
            path: "/posts/create",
            name: "create-post",
            component: () => import("../views/CreatePostView.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/posts/:id",
            name: "post-details",
            component: () => import("../views/PostDetailsView.vue")
        },
        {
            path: "/favorites",
            name: "favorites",
            component: () => import("../views/FavoritesView.vue")
        },
        {
            path: "/contact",
            name: "contact",
            component: () => import("../views/ContactView.vue")
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component: () => import("../views/NotFoundView.vue")
        }
    ],

    scrollBehavior() {
        return { top: 0 };
    }
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return {
            name: "login",
            query: {
                redirect: to.fullPath
            }
        };
    }

    if (to.name === "login" && authStore.isAuthenticated) {
        return {
            name: "posts"
        };
    }

    return true;
});

export default router;