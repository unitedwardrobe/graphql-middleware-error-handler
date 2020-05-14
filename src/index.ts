import { IMiddlewareFunction } from 'graphql-middleware';

export type IErrorHandler<Context> = (
  error: any,
  context: Context
) => Promise<void>;

export interface IOptions<Context> {
  onError: IErrorHandler<Context>;
  captureReturnedErrors?: boolean;
  forwardErrors?: boolean;
}

export const errorHandler = <Context>({
  onError,
  captureReturnedErrors = false,
  forwardErrors = false,
}: IOptions<Context>): IMiddlewareFunction => {
  // Return middleware resolver
  return async (resolve, parent, args, ctx, info) => {
    try {
      const res = await resolve(parent, args, ctx, info);
      if (captureReturnedErrors && res instanceof Error) {
        await onError(res, ctx);
      }
      return res;
    } catch (err) {
      await onError(err, ctx);

      // Forward error
      if (forwardErrors) {
        throw err;
      }
    }
  };
};
