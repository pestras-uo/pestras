import { CommentsModel } from ".";
import { HttpError, HttpCode } from "@pestras/backend/util";

export async function deleteComment(this: CommentsModel, serial: string, issuer: string) {
  const date = new Date();
  const comment = await this.col.findOne(
    { serial },
    { projection: { create_date: 1, issuer: 1 } }
  );

  if (!comment)
    return true;

  if (issuer !== comment.issuer)
    throw new HttpError(HttpCode.UNAUTHORIZED, 'unauthorizedOwner');

  if (date.getTime() - comment.create_date.getTime() > 300000)
    throw new HttpError(HttpCode.FORBIDDEN, 'updateNotAllowed');

  await this.col.deleteOne({ serial });

  return true;
}


export async function deleteByRecord(this: CommentsModel, record: string) {
  await this.col.deleteMany({ record });

  return true;
}