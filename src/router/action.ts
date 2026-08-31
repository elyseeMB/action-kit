import type { BaseAction } from "#actions/base_action";
import type { Express } from "express";
import { ROUTE_META } from "./decorators.ts";
import { logger } from "#config/logger";

type ActionLoader<T extends abstract new (...args: []) => {}> = () => Promise<{
  default: T;
}>;

export async function defineRoute(
  app: Express,
  loader: ActionLoader<typeof BaseAction>,
) {
  try {
    const { default: module } = await loader();
    const { method, path } = module[ROUTE_META];
    //@ts-expect-error
    app[method](path, module.handleController());
  } catch (error) {
    logger.error({ error });
  }
}
