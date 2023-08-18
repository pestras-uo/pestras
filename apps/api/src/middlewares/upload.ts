import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config';
import { extension } from 'mime-types';
import { Request } from 'express';
import { HttpError, HttpCode } from '@pestras/backend/util';
import { Serial } from '@pestras/shared/util';

const attachmentsStorage = multer.diskStorage({
  destination: function (req: Request, __, cb) {
    const dir = path.join(config.uploadsDir, 'attachments', req.body.entity);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (_, file, cb) {
    cb(null, Serial.gen("DOC") + "." + (extension(file.mimetype) || 'txt'));
  }
});

const avatarStorage = multer.diskStorage({
  destination: function (_, __, cb) {
    const dir = path.join(config.uploadsDir, 'avatars');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (_, file, cb) {
    if (['jpeg', 'jpg', 'png', 'webp'].includes(extension(file.mimetype) as string))
      cb(null, Serial.gen("AVT") + "." + (extension(file.mimetype)));
    else
      cb(new HttpError(HttpCode.BAD_REQUEST, 'invalidFileType'), '')
  }
});

const logoStorage = multer.diskStorage({
  destination: function (_, __, cb) {
    const dir = path.join(config.uploadsDir, 'logos');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (_, file, cb) {
    console.log({file});
    if (['jpeg', 'jpg', 'png', 'webp'].includes(extension(file.mimetype) as string))
      cb(null, Serial.gen("LGO") + "." + (extension(file.mimetype)));
    else
      cb(new HttpError(HttpCode.BAD_REQUEST, 'invalidFileType'), '')

  }
});

const imagesStorage = multer.diskStorage({
  destination: function (req, __, cb) {
    const dir = path.join(config.uploadsDir, 'images', req.params.serial ?? '');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (_, file, cb) {
    if (['jpeg', 'jpg', 'png', 'webp'].includes(extension(file.mimetype) as string))
      cb(null, Serial.gen("IMG") + "." + (extension(file.mimetype)));
    else
      cb(new HttpError(HttpCode.BAD_REQUEST, 'invalidFileType'), '')
  }
});

const attachmentsUpload = multer({ storage: attachmentsStorage, limits: { fileSize: config.maxDocumentUploadSize } });
const avatarUpload = multer({ storage: avatarStorage, limits: { fileSize: config.maxAvatarUploadSize } });
const logoUpload = multer({ storage: logoStorage, limits: { fileSize: config.maxAvatarUploadSize } });
const imagesUpload = multer({ storage: imagesStorage, limits: { fileSize: config.maxImageUploadSize } });

export { attachmentsUpload, avatarUpload, logoUpload, imagesUpload };