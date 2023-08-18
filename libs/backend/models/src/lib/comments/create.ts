import { CommentsModel } from ".";
import { Comment } from "@pestras/shared/data-model"
import { Serial } from '@pestras/shared/util';

export async function create(this: CommentsModel, record: string, text: string, issuer: string) {
  const date = new Date();
  const comment: Comment = {
    serial: Serial.gen('CMT'),
    record: record, 
    text, 
    issuer: issuer, 
    create_date: date, 
    last_modified: date
  }

  await this.col.insertOne(comment);

  return comment;
}