import type { DBSchema } from "idb";

export interface MediaDB extends DBSchema {

  media: {
    key: string; // video ID
    value: {
      key: string;
      status: boolean;
      videoFileName: string;
      thumbnail: File | any; // URL or base64
      readingVolume: number;
      videoUrl?: string; // URL to the video file
      createdBy: string; // user ID or name
      lastEditedBy: string; // user ID or name
      createdAt: Date | string; // Use string if you want to display formatted date
      updatedAt: Date | string; // Use string if you want to display formatted date
      publish: Date | string;
    };

    // indexes: {
    //   'by-status': string;
    //   'by-created-by': Date;
    //   'by-created-date': Date;
    //   'by-updated-date': Date;
    // };
  };
}

