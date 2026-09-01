import { router } from "#router/builder";
import { userRoutes } from "#router/definitions";

export function registerRoutes() {
  return router
    .group(() => {
      router.use(userRoutes());
    })
    .prefix("/api/v1");
}
