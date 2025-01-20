import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.router";
import { UserRoute } from "../modules/User/user.router";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoute,
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
