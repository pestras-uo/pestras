/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityTypes } from "@pestras/shared/data-model";
import { NotificationsModel } from ".";

export function changeListener(this: NotificationsModel) {


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