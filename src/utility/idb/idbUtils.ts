import { openDB,type IDBPDatabase } from 'idb';
import type { MediaDB } from './idbType';


const DB_NAME = 'MultimediaDB';
const DB_VERSION = 4;


let dbInstance: IDBPDatabase<MediaDB> | null = null;


export const getDB = async (): Promise<IDBPDatabase<MediaDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<MediaDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`Upgrading database from ${oldVersion} to ${newVersion}`);

      if (!db.objectStoreNames.contains('media')) {
        const multimedia = db.createObjectStore('media', {
          keyPath: 'key',
        });
      }
    
    },
  });

  return dbInstance;
};

