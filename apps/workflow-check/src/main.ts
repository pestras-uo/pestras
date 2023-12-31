import { db } from "@pestras/backend/util";
import config from "./config";
import nodeCron from 'node-cron';
import { job } from "./job";

(async () => {

  const conn = await db.connect(config);

  // Production only
  //will run every day at 12:00 AM
  // nodeCron.schedule("0 0 * * *", () => job(conn));

  // development only
  job(conn);
})();