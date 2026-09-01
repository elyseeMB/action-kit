import type { BaseAction } from "#actions/base_action";
import { logger } from "#config/logger";
import type { Express, IRouter, RequestHandler } from "express";
import { Router } from "express";
import { ROUTE_META } from "./decorators.ts";

type ActionLoader = () => Promise<{ default: typeof BaseAction }>;

class RouteDefinition {
  readonly middlewares: RequestHandler[] = [];

  constructor(private readonly loader: ActionLoader) {}

  middleware(...mw: RequestHandler[]): this {
    this.middlewares.push(...mw);
    return this;
  }

  async register(app: IRouter) {
    try {
      const { default: mod } = await this.loader();
      const { method, path } = mod[ROUTE_META];
      //@ts-expect-error dynamic method access
      app[method](path, ...this.middlewares, mod.handleController());
    } catch (error) {
      logger.error({ error });
    }
  }
}

class RouteGroup {
  private readonly entries: (RouteDefinition | RouteGroup)[] = [];
  private readonly middlewares: RequestHandler[] = [];
  private prefixPath = "/";

  add(entry: RouteDefinition | RouteGroup) {
    this.entries.push(entry);
  }

  prefix(path: string): this {
    this.prefixPath = path;
    return this;
  }

  middleware(...mw: RequestHandler[]): this {
    this.middlewares.push(...mw);
    return this;
  }

  async register(app: IRouter) {
    const router = Router();
    if (this.middlewares.length) {
      router.use(...this.middlewares);
    }
    await Promise.all(this.entries.map((e) => e.register(router)));
    app.use(this.prefixPath, router);
  }

  async boot(app: Express) {
    await this.register(app);
  }
}

let currentGroup: RouteGroup | null = null;

export const router = {
  route(loader: ActionLoader): RouteDefinition {
    if (!currentGroup) {
      throw new Error(
        "router.route() doit être appelé à l'intérieur de router.group()",
      );
    }
    const def = new RouteDefinition(loader);
    currentGroup.add(def);
    return def;
  },

  use(entry: RouteDefinition | RouteGroup) {
    if (!currentGroup) {
      throw new Error(
        "router.use() doit être appelé à l'intérieur de router.group()",
      );
    }
    currentGroup.add(entry);
  },

  group(callback: () => void): RouteGroup {
    const grp = new RouteGroup();
    const previous = currentGroup;
    currentGroup = grp;
    try {
      callback();
    } finally {
      currentGroup = previous;
    }
    previous?.add(grp);
    return grp;
  },
};
