import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>;
            files?: { [key: string]: UploadedFile | UploadedFile[] };
        }
    }
}
