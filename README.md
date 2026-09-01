# Action Kit

A lightweight, type-safe action-based architecture for Node.js.

## Features

- Class-based actions
- Type-safe route decorators
- Lazy-loaded actions
- Built-in controller handling
- Reusable action logic
- Async support

## Example

```ts
import { BaseAction } from '#actions/base_action';
import { Get } from '#router/decorators';

@Get('/users')
export default class GetUsers extends BaseAction {
  async asController(req, res) {
    const users = await this.handle();
    return res.json(users);
  }

  async handle() {
    return [];
  }
}
```

## License

MIT
