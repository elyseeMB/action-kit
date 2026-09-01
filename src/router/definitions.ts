import { router } from "./builder.ts";

export function userRoutes() {
  return router.route(
    () => import("#actions/users/get_user_profile", import.meta.hot?.boundary),
  );
}
