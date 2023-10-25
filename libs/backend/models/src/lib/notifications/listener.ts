/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity, EntityTypes, Notification, PublishNotification, Role } from "@pestras/shared/data-model";
import { NotificationsModel } from ".";
import { commentsModel, dataRecordsModel, usersModel } from "../models";

export function changeListener(this: NotificationsModel) {

  // records approve: notify owner
  this.channel.onActivity<any>({ method: 'approve', entity: EntityTypes.DATA_STORE }, async activity => {
    //
  });


  // records REJECT: notify owner
  this.channel.onActivity<any>({ method: 'reject', entity: EntityTypes.DATA_STORE }, async activity => {
    //
  });





  // comments create: notify all commenters
  this.channel.onActivity({ method: 'create', entity: EntityTypes.COMMENT }, async activity => {
    //
  });





  // messages create: notify reciever
  this.channel.onActivity({ method: 'create', entity: EntityTypes.MESSAGE }, activity => {
    //
  });




  // data store change owner: notify new owner
  this.channel.onActivity<any>({ method: 'setOwner', entity: EntityTypes.DATA_STORE }, async activity => {
    //
  });
  // data store add contributer: notify new contributer
  this.channel.onActivity<any>({ method: 'addCollaborator', entity: EntityTypes.DATA_STORE }, async activity => {
    //
  });
}