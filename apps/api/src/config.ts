import path from 'path';

const config = {
  // env
  mode: process.env.NODE_ENV || "development",
  prod: process.env.NODE_ENV === "production",
  
  
  // server
  host: process.env.HOST,
  port: +(process.env.PORT || 0) || 3000,
  sslKeyPath: process.env.SSL_KEY_PATH,
  sslCertPath: process.env.SSL_CERT_PATH,
  
  // cors
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',

  // session token
  tokenSecret: process.env.TOKEN_SECRET || "test",
  sessionTokenExpiry: +(process.env.SESSION_TOKEN_EXP || 0) || 1000 * 60 * 60 * 24,
  rememberSessionTokenExpiry: +(process.env.REMEMBER_SESSION_TOKEN_EXP || 0) || 1000 * 60 * 60 * 24 * 30,

  // database
  dbUoName: process.env.DB_UO_NAME,
  dbUoAdName: process.env.DB_UO_AD_NAME,
  dbUoDataName: process.env.DB_UO_DATA_NAME,
  dbUrl: process.env.DB_STR,

  // upload files config
  uploadsDir: path.join(process.cwd(), 'public', 'uploads'),
  assetsDir: path.join(process.cwd(), 'public', 'assets'),
  maxDocumentUploadSize: +(process.env.MAX_DOC_UPLOAD_SIZE || 0) || (1024 * 1024),
  maxAvatarUploadSize: +(process.env.MAX_AVA_UPLOAD_SIZE || 0) || (1024 * 64),
  maxLogoUploadSize: +(process.env.MAX_LOGO_UPLOAD_SIZE || 0) || (1024 * 64),
  maxImageUploadSize: +(process.env.MAX_IMAGE_UPLOAD_SIZE || 0) || (1024 * 512),
  maxIconsUploadSize: +(process.env.MAX_ICON_UPLOAD_SIZE || 0) || (1024 * 16)
} as const;

export default config;