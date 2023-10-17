import { MongoClient } from "mongodb";
import config from "./config";
import { DataStore, Workflow } from "@pestras/shared/data-model";

export async function job(conn: MongoClient) {
  // your code
  const sysDb = conn.db(config.sysDb);
  const dataDb = conn.db(config.dataDb);


  // step 1: fetch data stores with workflow activated
  const dataStores = await sysDb.collection<DataStore>("data-stores").find({
    $or: [
      { 'settings.workflow.create': { $type: 'string' } },
      { 'settings.workflow.update': { $type: 'string' } },
      { 'settings.workflow.delete': { $type: 'string' } }
    ]
  }, { projection: { serial: 1, settings: 1 } }).toArray();

  for (const ds of dataStores) {
    const wfSerial = Object.keys(ds.settings.workflow).reduce(((wf, action) => typeof wf === 'string' ? wf : action), '');
    const workflowDefinition = await sysDb.collection<Workflow>("workflows").findOne({ serial: wfSerial });

    if (!workflowDefinition)
      continue;

    // |  - fetch all active steps
    // |  - for each active step
    // |  |  - check if step exceeded days limit
    // |  |  - apply default action for each user
    // |  |  |  case 1: state is rejection     
    // |  |  |  |  case 1: action was delete     
    // |  |  |  |  |  - move record from review table to approve table 
    // |  |  |  |  case 2: else     
    // |  |  |  |  |  - move record from review table to draft table 
    // |  |  |  |  - delete all workflow steps 
    // |  |  |  case 1: state is approval
    // |  |  |  |  case 1: is last step
    // |  |  |  |  |  case 1: action was delete
    // |  |  |  |  |  |  - remove record from review and approve tables
    // |  |  |  |  |  case 2: else
    // |  |  |  |  |  |  - move record from review table to approve tables
    // |  |  |  |  case 2: not last step
    // |  |  |  |  |  - add new step with default state to record woekflow.

  }
}