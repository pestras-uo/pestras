const config = {
  // env
  mode: process.env.NODE_ENV || "development",
  prod: process.env.NODE_ENV === "production",
  host: process.env.HOST,
  port: +process.env.PORT || 3200,

  // database
  dbUoName: process.env.DB_UO_NAME,
  dbUoAdName: process.env.DB_UO_AD_NAME,
  dbUoDataName: process.env.DB_UO_DATA_NAME,
  dbUrl: process.env.DB_STR
} as const;

export default config;