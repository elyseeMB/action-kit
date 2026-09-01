import type { Request, Response } from 'express';
import { BaseAction } from '#actions/base_action';
import { edge } from '#config/edge';
import { Get } from '#router/decorators';

@Get('/user/:id')
export default class GetUserProfile extends BaseAction {
  async asController(req: Request, res: Response, data?: unknown, ...args: any[]) {
    // const { id } = req.params;
    const html = await edge.render('index', { title: 'hello world ' });
    return res.send(html);
    // const comments = await GetComments.run(id as string);
    // return res.json(comments);
  }
}
