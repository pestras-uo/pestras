import { MongoClient } from "mongodb";
import config from "./config";

export function job(conn: MongoClient) {
  // your code
  const sysDb = conn.db(config.sysDb);

  // step 1: fetch data stores with workflow activated

  // - for each data store
  // |  - fetch workflow settings
  // |  - fetch all active steps
  // |  - for each active step
  // |  |  - check if step exceeded days limit
  // |  |  - apply default action for each user
  // |  |  - get overall step state   
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
  // |  |  |  |  |  |  - delete all workflow steps 
  // |  |  |  |  case 2: not last step
  // |  |  |  |  |  - add new step with default state to record woekflow.
}