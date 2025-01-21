import express from "express";
import { UserRouters } from "../modules/User/user.router";
import { AuthRouters } from "../modules/Auth/auth.router";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRouters,
  },
  {
    path: "/users",
    route: UserRouters,
  },

  // {
  //   path: "/accounts",
  //   // route: AccountRoutes,
  // },

  // {
  //   path: "/goals",
  //   // route: GoalRoutes,
  // },

  // {
  //   path: "/investments",
  //   // route: InvestmentRoutes,
  // },

  // {
  //   path: "/investmentPortfolios",
  //   // route: InvestmentPortfolioRoutes,
  // },

  // {
  //   path: "/profile",
  //   // route: ProfileRoutes,
  // },
  // {
  //   path: "/profileVisitors",
  //   // route: ProfileVisitorRoutes,
  // },
  // {
  //   path: "/savingPlans",
  //   // route: CommentRoutes,
  // },
  // {
  //   path: "/subscriptionPlans",
  //   // route: CommentRoutes,
  // },
  // {
  //   path: "/userSubscriptions",
  //   // route: CommentRoutes,
  // },
];

moduleRoutes
  .filter((route) => route.route)
  .forEach((route) => router.use(route.path, route.route));

export default router;
