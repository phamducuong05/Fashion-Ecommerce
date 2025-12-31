import { env } from './config/env';

console.log("---- ENV CHECK START ----");
console.log("MAIL_USER from env object:", env.MAIL_USER);
console.log("VNP_TMNCODE from env object:", env.VNP_TMNCODE);
console.log("process.env.MAIL_USER:", process.env.MAIL_USER);
console.log("---- ENV CHECK END ----");
