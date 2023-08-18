import { CommentsModel } from ".";

export function getComments(this: CommentsModel, record: string, skip = 0, limit = 10) {
  return this.col.find(
    { record },
    { sort: { serial: -1 }, skip, limit }
  ).toArray();

}

export async function getCommentors(this: CommentsModel, record: string) {
  const issuers = await this.col.find({ record }, { projection: { issuer: 1 } }).toArray();

  return [...new Set(issuers.map(c => c.issuer))];
}