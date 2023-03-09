import {Request, Response} from 'express';
import {z} from 'zod';
import {getJwtFromRequest} from '../utils/getJwtFromRequest';

// inspired by https://github.com/colinhacks/zod/discussions/2032#discussioncomment-4943969
// and inspired by https://trpc.io/
export const createController = <
  AuthRequired extends boolean,
  ZodSchema extends z.ZodTypeAny = z.ZodNever
>({
  bodySchema,
  authRequired,
  controller,
}: {
  bodySchema?: ZodSchema | undefined;
  authRequired?: AuthRequired;
  controller: (options: {
    body: ZodSchema extends z.ZodTypeAny
      ? z.infer<ZodSchema>
      : never | undefined;
    token: AuthRequired extends true ? string : null;
  }) => Promise<unknown>;
}): Handler => {
  return async (req: Request, res: Response) => {
    // parses the jwt token from authorisation header, if needed
    let token: string | null = null;
    if (authRequired) {
      token = getJwtFromRequest(req);
      if (!token)
        return res.status(401).json({
          success: false,
        });
    }

    // parses the body with given schema, if needed
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

    // dumps the parsed data to the handler
    return controller({
      body,
      token: token as AuthRequired extends true ? string : null,
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
