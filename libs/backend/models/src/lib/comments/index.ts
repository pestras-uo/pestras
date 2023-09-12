import { Model } from "../model";
import { getCommentors, getComments } from "./read";
import { create } from "./create";
import { update } from "./update";
import { Comment } from "@pestras/shared/data-model";
import { deleteByRecord, deleteComment } from "./delete";

export class CommentsModel extends Model<Comment> {

  // getters
  // -----------------------------------------------------------------------------------
  getComments: (record: string, skip?: number, limit?: number) => Promise<Comment[]> = getComments.bind(this);
  getCommentors: (record: string) => Promise<string[]> = getCommentors.bind(this);

  // create
  // -----------------------------------------------------------------------------------
  create: (record: string, text: string, issuer: string) => Promise<Comment> = create.bind(this);

  // update
  // -----------------------------------------------------------------------------------
  update: (serial: string, text: string, issuer: string) => Promise<Date> = update.bind(this);

  // delete
  // -----------------------------------------------------------------------------------
  delete: (serial: string, issuer: string) => Promise<boolean> = deleteComment.bind(this);
  deleteByRecord: (record: string) => Promise<boolean> = deleteByRecord.bind(this);
}