import { Validall } from "@pestras/validall";

export enum CommentsValidators {
  CREATE = 'createComment',
  UPDATE = 'updateComment'
}

const COMMENT_TEXT = 'commentTextSchema';

new Validall(COMMENT_TEXT, {
  $and: [
    { $type: 'string', $message: 'invalidCommentText' },
    { $length: { $lte: 200 }, $message: 'commentTextExceedsLengthLimit' }
  ]
})

new Validall(CommentsValidators.CREATE, {
  text: { $ref: COMMENT_TEXT }
});

new Validall(CommentsValidators.UPDATE, {
  text: { $ref: COMMENT_TEXT }
});