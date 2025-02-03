export interface IMulterFile {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
  }

  export type updateRequestType = {
    username: string;
    degreeCertificateUrl: string;
    resumeUrl: string;
    status:string
  };
  