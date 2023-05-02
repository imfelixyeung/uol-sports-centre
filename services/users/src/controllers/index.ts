import {Request, Response} from 'express';
import {z} from 'zod';
import {getJwtFromRequest} from '../utils/getJwtFromRequest';
import {JwtData} from '../utils/JwtData';

// inspired by https://github.com/colinhacks/zod/discussions/2032#discussioncomment-4943969
// and inspired by https://trpc.io/
export const createController = <
  J extends boolean,
  Z extends z.ZodTypeAny = z.ZodNever
>({
  bodySchema,
  authRequired,
  controller,
}: {
  bodySchema?: Z | undefined;
  authRequired?: J;
  controller: (opts: {
    body: Z extends z.ZodTypeAny ? z.infer<Z> : never | undefined;
    token: J extends true ? string : null;
  }) => Promise<unknown>;
}): Handler => {
  return async (req: Request, res: Response) => {
    const token: string | null = null;
    if (authRequired) {
      const token: JwtData | null = getJwtFromRequest(req);
      if (!token)
        return res.status(401).json({
          success: false,
        });
    }

    let body = null;

    if (bodySchema) {
      const parsedBody = bodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({
          success: false,
          error: parsedBody.error,
        });
      }

      body = parsedBody.data;
    }

    return controller({
      body,
      token: token as J extends true ? string : null,
    })
      .then(data =>
        res.json({
          success: true,
          data,
        })
      )
      .catch(error =>
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : error,
        })
      );
  };
};

export type Handler = (req: Request, res: Response) => unknown;
