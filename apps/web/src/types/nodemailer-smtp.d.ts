// The SMTP transport is separate from Auth.js's unused optional email provider.
// Nodemailer 10 retains this transport API; keep the published transport types.
declare module 'nodemailer-smtp' {
  import nodemailer = require('nodemailer');
  export = nodemailer;
}
