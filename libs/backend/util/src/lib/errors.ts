/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpCode } from "./http-codes";

export class HttpError extends Error {

  constructor(public readonly code: HttpCode, message: string, public readonly info: any = null) {
    super(message);
  }
}