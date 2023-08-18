import { Model } from "../model";
import { getCommentors, getComments } from "./read";
import { create } from "./create";
import { update } from "./update";
import { Comment } from "@pestras/shared/data-model";
import { deleteByRecord, deleteComment } from "./delete";

export class CommentsModel extends Model<Comment> {

  // getters
  // -----------------------------------------------------------------------------------
  getComments = getComments.bind(this);
  getCommentors = getCommentors.bind(this);

  // create
  // -----------------------------------------------------------------------------------
  create = create.bind(this);

  // update
  // -----------------------------------------------------------------------------------
  update = update.bind(this);

  // delete
  // -----------------------------------------------------------------------------------
  delete = deleteComment.bind(this);
  deleteByRecord = deleteByRecord.bind(this);
}