import { defineRoute } from "#router/action";
import type { Express } from "express";

export async function registerRoutes(app: Express) {
  await defineRoute(
    app,
    () => import("#actions/users/get_user_profile", import.meta.hot?.boundary),
  );
}
