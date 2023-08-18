import { CommentsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function update(this: CommentsModel, serial: string, text: string, issuer: string) {
  const date = new Date();
  const comment = await this.col.findOne(
    { serial },
    { projection: { create_date: 1, issuer: 1 } }
  );

  if (!comment)
    throw new HttpError(HttpCode.NOT_FOUND, "commentNotFound");

  if (issuer !== comment.issuer)
    throw new HttpError(HttpCode.UNAUTHORIZED, 'unauthorizedOwner');

  if (date.getTime() - comment.create_date.getTime() > 300000)
    throw new HttpError(HttpCode.FORBIDDEN, 'updateNotAllowed');

  await this.col.updateOne({ serial }, { $set: { text, last_modified: date } });

  return date;
}