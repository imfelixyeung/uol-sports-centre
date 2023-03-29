import {Request, Response} from 'express';
import {z} from 'zod';
import {UserRole} from '~/config';
import {TokenRegistry} from '~/persistence/tokens';
import {JsonWebTokenPayload, jsonWebTokenPayloadSchema} from '~/schema/jwt';
import {getJwtFromRequest} from '~/utils/getJwtFromRequest';

// inspired by https://github.com/colinhacks/zod/discussions/2032#discussioncomment-4943969
// and inspired by https://trpc.io/
export const createController = <
  AuthRequired extends boolean,
  ZodSchemaQuery extends z.ZodTypeAny = z.ZodNever,
  ZodSchemaBody extends z.ZodTypeAny = z.ZodNever
>({
  bodySchema,
  querySchema,
  authRequired,
  roleRequired,
  controller,
}: {
  querySchema?: ZodSchemaQuery | undefined;
  bodySchema?: ZodSchemaBody | undefined;
  authRequired?: AuthRequired;
  roleRequired?: UserRole[];
  controller: (options: {
    query: ZodSchemaQuery extends z.ZodTypeAny
      ? z.infer<ZodSchemaQuery>
      : never | undefined;
    body: ZodSchemaBody extends z.ZodTypeAny
      ? z.infer<ZodSchemaBody>
      : never | undefined;
    token: AuthRequired extends true ? string : null;
    session: AuthRequired extends true ? JsonWebTokenPayload | null : null;
  }) => Promise<unknown>;
}): Handler => {
  return async (req: Request, res: Response) => {
    // parses the jwt token from authorisation header, if needed
    let token: string | null = null;
    let session: JsonWebTokenPayload | null = null;
    if (authRequired || roleRequired) {
      token = getJwtFromRequest(req);
      if (!token)
        return res.status(401).json({
          success: false,
          message: 'Missing token',
        });

      const payload = await TokenRegistry.verifyToken(token).catch(() => null);
      const parsedPayload = jsonWebTokenPayloadSchema.safeParse(payload);
      if (!parsedPayload.success) {
        return res.status(401).json({
          success: false,
          message: 'Malformed token',
        });
      }
      session = parsedPayload.data;

      const userRole = session.user.role;
      if (roleRequired && !roleRequired.includes(userRole))
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
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

    let query = null;
    if (querySchema) {
      const parsedQuery = querySchema.safeParse({
        ...req.query,
        ...req.params,
      });
      if (!parsedQuery.success) {
        return res.status(400).json({
          success: false,
          error: parsedQuery.error,
        });
      }

      query = parsedQuery.data;
    }

    // dumps the parsed data to the handler
    return controller({
      body,
      query,
      token: token as AuthRequired extends true ? string : null,
      session: session as AuthRequired extends true
        ? JsonWebTokenPayload | null
        : null,
    })
      .then(data =>
        res.json({
          success: true,
          data,
        })
      )
      .catch(error => {
        if (error instanceof APIError) {
          return res.status(error.status).json({
            success: false,
            error: error.message,
          });
        }

        return res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : error,
        });
      });
  };
};

export type Handler = (req: Request, res: Response) => unknown;

// APIError inspired by https://trpc.io/docs/error-handling
export class APIError extends Error {
  public status: number;
  public cause?: unknown;
  constructor(error: {message: string; status: number; cause?: unknown}) {
    const {message} = error;
    super(message);
    this.status = error.status;
    this.cause = error.cause;
  }
}
