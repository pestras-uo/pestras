/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityTypes, Notification, Role } from "@pestras/shared/data-model";
import { NotificationsModel } from ".";

export function changeListener(this: NotificationsModel) {

  // Publish: notify admin
  this.pubSub.onActivity({ method: 'publish' }, async activity => {
    try {
      const issuer = await this.usersModel.getBySerial(activity.issuer, { roles: 1, orgunit: 1 });
  
      if (!issuer || issuer.roles.includes(Role.ADMIN))
        return;
  
      const admin = await this.usersModel.electAdmin(issuer.orgunit, { serial: 1 });
  
      if (admin)
        this.create({ ...activity, target: admin.serial, seen_date: null });
      
    } catch (error) {
      console.error(error);
    }
  });





  // comments create: notify all commenters
  this.pubSub.onActivity({ method: 'create', entity: EntityTypes.COMMENT }, async activity => {
    try {
      const targets = await this.commentsModel.getCommentors(activity.entity);
      const list: Omit<Notification, 'serial'>[] = [];
  
      for (const target of targets)
        list.push({ ...activity, target, seen_date: null });
  
      if (list.length)
        this.createMany(list);
      
    } catch (error) {
      console.error(error);
    }
  });





  // messages create: notify reciever
  this.pubSub.onActivity({ method: 'create', entity: EntityTypes.MESSAGE }, activity => {
    //
  });




  // data store change owner: notify new owner
  this.pubSub.onActivity<any>({ method: 'setOwner', entity: EntityTypes.DATA_STORE }, async activity => {
    try {
      this.create({ ...activity, target: activity.payload['user'], seen_date: null });
      
    } catch (error) {
      console.error(error);
    }
  });
  // data store add contributer: notify new contributer
  this.pubSub.onActivity<any>({ method: 'addCollaborator', entity: EntityTypes.DATA_STORE }, async activity => {
    try {
      this.create({ ...activity, target: activity.payload['collaborator'], seen_date: null });
      
    } catch (error) {
      console.error(error);
    }
  });






  // records approve: notify owner
  this.pubSub.onActivity<any>({ method: 'approve', entity: EntityTypes.DATA_STORE }, async activity => {
    try {
      const record = await this.dataRecordsModel.getBySerial(activity.serial, activity.payload['record']);
  
      if (record?.owner && activity.issuer !== record.owner)
        this.create({ ...activity, target: record.owner, seen_date: null });
      
    } catch (error) {
      console.error(error);
    }
  });
  // records REJECT: notify owner
  this.pubSub.onActivity<any>({ method: 'reject', entity: EntityTypes.DATA_STORE }, async activity => {
    try {
      const record = await this.dataRecordsModel.getBySerial(activity.serial, activity.payload['record']);
  
      if (record?.owner && activity.issuer !== record.owner)
        this.create({ ...activity, target: record.owner, seen_date: null });
      
    } catch (error) {
      console.error(error);
    }
  });
}