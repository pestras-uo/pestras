const config = {
  // env
  mode: process.env.NODE_ENV || "development",
  prod: process.env.NODE_ENV === "production",
  host: process.env.HOST,
  port: +process.env.PORT || 3200,

  // database
  sysDb: process.env.SYS_DB,
  adDb: process.env.AD_DB,
  dataDb: process.env.DATA_DB,
  dbUrl: process.env.DB_STR
} as const;

export default config;