import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
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

export default router;