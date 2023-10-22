import { MongoClient, Db } from 'mongodb';
import config from './config';
import {
  DataStore,
  RecordWorkflow,
  RecordWorkflowState,
  TableDataRecord,
  UserWorkflowAction,
  Workflow,
} from '@pestras/shared/data-model';

//  Create a Map to store cached data---Optimization
const dataCache: Map<string, RecordWorkflowState[]> = new Map();

/**
 * Function to fetch record workflow data from the database with caching.
 * @param dataDb - Database connection object
 * @param dsSerial - Data store serial number
 */
export async function getRecordWorkflow(dataDb: Db, dsSerial: string) {
  // Check if data is in the cache
  const cacheKey = `workflow_${dsSerial}`;
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }

  // If data is not in the cache, fetch it from the database
  const workflowData = await dataDb
    .collection<RecordWorkflowState>(cacheKey)
    .find({})
    .toArray();

  // Store data in the cache for future use
  dataCache.set(cacheKey, workflowData);

  return workflowData;
}

/**
 * Main job function to process active workflows.
 * @param conn - MongoDB client connection
 */
export async function job(conn: MongoClient) {
  const sysDb = conn.db(config.sysDb);
  const dataDb = conn.db(config.dataDb);
  const date = new Date();

  // Fetch data stores with activated workflows
  const dataStores = await sysDb
    .collection<DataStore>('data_stores')
    .find(
      {
        $or: [
          { 'settings.workflow.create': { $type: 'string' } },
          { 'settings.workflow.update': { $type: 'string' } },
          { 'settings.workflow.delete': { $type: 'string' } },
        ],
      },
      { projection: { serial: 1, settings: 1 } }
    )
    .toArray();

  // Iterate through each data store with an activated workflow
  for (const ds of dataStores) {
    // Fetch active workflows for the current data store
    const activeWorkflows = await getRecordWorkflow(dataDb, ds.serial);

    // Iterate through active workflows
    for (const aw of activeWorkflows) {
      const stateReview = aw.workflows.find((w) => w.state === 'review');
      if (!stateReview) {
        continue;
      }

      // TODO: fetch from cache if exists else fetch from database
      // Fetch workflow definition based on serial
      const workflowDefinition = await sysDb
        .collection<Workflow>('workflows')
        .findOne({ serial: stateReview.workflow });

      if (!workflowDefinition) continue;

      // Find the current step index in the workflow
      const currentStepIndex = stateReview.steps.findIndex(
        (step) => step.state === 'review'
      );
      const reviewStep = stateReview.steps[currentStepIndex];

      // Calculate days difference between current date and step start date
      const currentDate = new Date();
      const daysDifference = Math.floor(
        (currentDate.getTime() - reviewStep.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // TODO: move inside @condition#1
      // Fetch step definition based on step serial
      const stepDefinition = workflowDefinition.steps.find(
        (step) => step.serial === reviewStep.step
      );

      // TODO: move inside @condition#1
      if (!stepDefinition) continue;

      // Check if the current step is the last step in the workflow
      const isLastStep =
        currentStepIndex === workflowDefinition.steps.length - 1;

      // @condition#1
      // Perform actions based on workflow settings and user action
      if (daysDifference > stepDefinition.max_review_days) {
        const wfTrigger = stateReview.trigger;

        switch (stepDefinition.default_action) {
          case 'reject':
            // TODO: update step actions before updating workflow step.
            // Update workflow step state to 'reject'
            await updateWorkflowStep(
              dataDb,
              ds.serial,
              aw.record,
              reviewStep.step,
              reviewStep.actions,
              date,
              'reject'
            );

            // Perform action based on user action
            switch (wfTrigger) {
              case 'delete':
                await moveRecordFromReviewToApprovalTable(
                  dataDb,
                  ds.serial,
                  aw.record,
                  reviewStep.step,
                  reviewStep.actions,
                  date
                );
                break;
              default:
                await moveRecordFromReviewToDraftTable(
                  dataDb,
                  ds.serial,
                  aw.record
                );
                break;
            }
            break;
          case 'approve':
            // TODO: update step actions before updating workflow step.
            // Update workflow step state to 'approve'
            await updateWorkflowStep(
              dataDb,
              ds.serial,
              aw.record,
              reviewStep.step,
              reviewStep.actions,
              date,
              'approve'
            );
            if (isLastStep) {
              // Remove record from review and approve tables based on user action
              switch (wfTrigger) {
                case 'delete':
                  await removeRecordFromReviewAndApproveTables(
                    dataDb,
                    ds.serial,
                    aw.record
                  );
                  break;
                default:
                  await moveRecordToApproveTable(
                    dataDb,
                    ds.serial,
                    aw.record,
                    reviewStep.step,
                    reviewStep.actions,
                    date
                  );
                  break;
              }
            } else {
              // TODO: aeguments are missed up!!
              // Add a new step with default state to the record workflow
              const nextStepDefinition =
                workflowDefinition.steps[currentStepIndex + 1];
              await addNewStepWithDefaultState(
                dataDb,
                ds.serial,
                aw.record,
                nextStepDefinition.serial,
                reviewStep.step,
                reviewStep.actions,
                date
              );
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // Clear the cache after processing to free up memory
  dataCache.clear();
}

/**
 * Function to update workflow step state and actions.
 * @param db - Database connection object
 * @param dsSerial - Data store serial number
 * @param record - Record identifier
 * @param stepSerial - Step serial number
 * @param actions - User workflow actions
 * @param date - Date object
 * @param state - New state for the workflow step
 */
async function updateWorkflowStep(
  db: Db,
  dsSerial: string,
  record: string,
  stepSerial: string,
  actions: UserWorkflowAction[],
  date: Date,
  state: string
) {
  await db.collection<RecordWorkflowState>(`workflow_${dsSerial}`).updateOne(
    { record: record, 'workflows.serial': dsSerial },
    {
      $set: {
        'workflows.$.end_date': date,
        'workflows.$.state': state,
        'workflows.$.steps.$.actions': actions,
        'workflows.$.steps.$[step].end_date': date,
        'workflows.$.steps.$[step].state': state,
      },
    },
    { arrayFilters: [{ 'step.step': stepSerial }] }
  );
}
/**
 * Function to move a record from the review table to the approval table.
 * @param db - Database connection object
 * @param dsSerial - Data store serial number
 * @param record - Record identifier
 * @param stepSerial - Step serial number
 * @param actions - User workflow actions
 * @param date - Date object
 */
async function moveRecordFromReviewToApprovalTable(
  db: Db,
  dsSerial: string,
  record: string,
  stepSerial: string,
  actions: UserWorkflowAction[],
  date: Date
) {
  // TODO: none sence!!
  // Update workflow step state to 'reject'
  await updateWorkflowStep(
    db,
    dsSerial,
    record,
    stepSerial,
    actions,
    date,
    'reject'
  );
}

/**
 * Function to move a record from the review table to the draft table.
 * @param db - Database connection object
 * @param dsSerial - Data store serial number
 * @param recSerial - Record serial number
 */
async function moveRecordFromReviewToDraftTable(
  db: Db,
  dsSerial: string,
  recSerial: string
) {
  // Fetch the record from the review table
  const record = await db
    .collection<TableDataRecord>(`review_${dsSerial}`)
    .findOne({ serial: recSerial });

  // If the record is found, move it to the draft table
  if (record) {
    await db.collection<TableDataRecord>(`draft_${dsSerial}`).insertOne(record);
    await db
      .collection<TableDataRecord>(`review_${dsSerial}`)
      .deleteOne({ serial: recSerial });
  }
}

/**
 * Function to move a record to the approval table.
 * @param db - Database connection object
 * @param dsSerial - Data store serial number
 * @param record - Record identifier
 * @param stepSerial - Step serial number
 * @param actions - User workflow actions
 * @param date - Date object
 */
async function moveRecordToApproveTable(
  db: Db,
  dsSerial: string,
  record: string,
  stepSerial: string,
  actions: UserWorkflowAction[],
  date: Date
) {
  // TODO: none sence!!
  try {
    const result = await db.collection(`workflow_${dsSerial}`).updateOne(
      {
        record: record,
        'workflows.serial': dsSerial,
      },
      {
        $set: {
          'workflows.$.steps.$[step].actions': actions,
          'workflows.$.steps.$[step].end_date': date,
          'workflows.$.steps.$[step].state': 'approve',
        },
      },
      {
        arrayFilters: [{ 'step.step': stepSerial }],
      }
    );

    if (result.modifiedCount === 1) {
      console.log('Record moved to the approve table successfully.');
    } else {
      console.log('Failed to move record to the approve table.');
    }
  } catch (error) {
    console.error('Error moving record to the approve table:', error);
  }
}

/**
 * Function to remove a record from the review and approve tables.
 * @param db - Database connection object
 * @param dsSerial - Data store serial number
 * @param record - Record
 */
async function removeRecordFromReviewAndApproveTables(
  db: Db,
  dsSerial: string,
  record: string
) {
  // TODO: none sence!!
  try {
    const reviewResult = await db
      .collection(`workflow_${dsSerial}`)
      .findOneAndDelete({
        record: record,
        'workflows.serial': dsSerial,
        'workflows.steps.state': 'review',
      });

    const approveResult = await db
      .collection(`workflow_${dsSerial}`)
      .findOneAndDelete({
        record: record,
        'workflows.serial': dsSerial,
        'workflows.steps.state': 'approve',
      });

    if (reviewResult.ok === 1 && approveResult.ok === 1) {
      console.log(
        'Record removed from review and approve tables successfully.'
      );
    } else {
      console.log('Failed to remove record from review and approve tables.');
    }
  } catch (error) {
    console.error(
      'Error removing record from review and approve tables:',
      error
    );
  }
}

/**
 * Function to add a new step with default state to the record workflow.
 * @param db - Database connection object
 * @param dsSerial - Data store serial number
 * @param record - Record identifier
 * @param stepSerial - Step serial number
 * @param defaultState - Review step
 * @param date - Date object
 */
async function addNewStepWithDefaultState(
  db: Db,
  dsSerial: string,
  record: string,
  stepSerial: string,
  defaultState: string,
  actions: UserWorkflowAction[],
  date: Date
) {
  try {
    const newStep = {
      step: stepSerial,
      state: defaultState,
      start_date: date,
      end_date: null,
      actions: actions,
    };

    const result = await db.collection(`workflow_${dsSerial}`).updateOne(
      {
        record: record,
        'workflows.serial': dsSerial,
      },
      {
        $push: {
          'workflows.$.steps': newStep,
        },
      }
    );

    if (result.modifiedCount === 1) {
      console.log('New step added to the record workflow successfully.');
    } else {
      console.log('Failed to add a new step to the record workflow.');
    }
  } catch (error) {
    console.error('Error adding a new step to the record workflow:', error);
  }
}
