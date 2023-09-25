import { db } from "@pestras/backend/util";
import config from "./config";
import nodeCron from 'node-cron';
import { job } from "./job";

(async () => {

  await db.connect(config);

  //will run every day at 12:00 AM
  nodeCron.schedule("0 0 * * *", () => job(true));

  //will run every our at 12:00 AM
  nodeCron.schedule("0 * * * *", () => job(false));

})();