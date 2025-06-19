import type { DBSchema } from "idb";

export interface Media {
  frontendId: string;
  id: string;
  status: boolean;
  videoFileName: string;
  thumbnail: File;
  readingVolume: number;
  videoUrl?: string;
  createdBy: string;
  lastEditedBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  publish: Date | string;
  description?: string;
}
export interface MediaDB extends DBSchema {

  media: {
    key: string; // video ID
    value: Media;

    // indexes: {
    //   'by-status': string;
    //   'by-created-by': Date;
    //   'by-created-date': Date;
    //   'by-updated-date': Date;
    // };
  };
}

