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
    try {
      const dir = path.join(config.uploadsDir, 'attachments', req.body.parent, req.body.entity);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);

    } catch (error) {
      cb(error, null);
    }
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
    console.log({ file });
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
      cb(new HttpError(HttpCode.BAD_REQUEST, 'invalidFileType'), '');
  }
});

const contentStorage = multer.diskStorage({
  destination: function (req, __, cb) {
    const dir = path.join(config.uploadsDir, 'images', req.params.entity, 'tmp');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (_, file, cb) {
    if (['jpeg', 'jpg', 'png', 'webp'].includes(extension(file.mimetype) as string))
      cb(null, Serial.gen("IMG") + "." + (extension(file.mimetype)));
    else
      cb(new HttpError(HttpCode.BAD_REQUEST, 'invalidFileType'), '');
  }
});

const tmpStorage = multer.diskStorage({
  destination: function (req, __, cb) {
    const dir = path.join(config.uploadsDir, 'tmp');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (_, file, cb) {
    cb(null, Serial.gen("DOC") + "." + (extension(file.mimetype) || 'txt'));
  }
});

export const attachmentsUpload = multer({ storage: attachmentsStorage, limits: { fileSize: config.maxDocumentUploadSize } });
export const tmpUpload = multer({ storage: tmpStorage, limits: { fileSize: config.maxDocumentUploadSize } });
export const avatarUpload = multer({ storage: avatarStorage, limits: { fileSize: config.maxAvatarUploadSize } });
export const logoUpload = multer({ storage: logoStorage, limits: { fileSize: config.maxAvatarUploadSize } });
export const imagesUpload = multer({ storage: imagesStorage, limits: { fileSize: config.maxImageUploadSize } });
export const contentUpload = multer({ storage: contentStorage, limits: { fileSize: config.maxImageUploadSize } });