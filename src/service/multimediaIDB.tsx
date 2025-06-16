import type { Media } from "../utility/idb/idbType";
import { getDB } from "../utility/idb/idbUtils";

export type Video = Media;
// omit remove the specified keys from the type
export type VideoInput = Omit<Video, 'frontendId' | 'id' | 'createdAt' | 'updatedAt'>;
// Partial makes all properties optional
export type VideoUpdate = Partial<Omit<Video, 'frontendId' | 'id' | 'createdAt'>>;

export class VideoService {
    // Create new video
    static async createVideo(videoData: VideoInput): Promise<string> {
        const db = await getDB();
        const now = new Date();

        const video: Video = {
            frontendId: crypto.randomUUID(), // Generate a unique key
            ...videoData,
            id: "0",
            createdAt: now,
            updatedAt: now,
        };

        await db.add('media', video);
        return video.id;
    }

    // Get single video
    static async getVideo(id: string): Promise<Video | undefined> {
        const db = await getDB();
        return db.get('media', id);
    }

    // Get all videos
    static async getAllVideos(): Promise<Video[]> {
        const db = await getDB();
        return db.getAll('media');
    }

    // Update video
    static async updateVideo(id: string, updates: VideoUpdate): Promise<void> {
        const db = await getDB();
        const existing = await db.get('media', id);

        if (!existing) {
            throw new Error(`Video with id ${id} not found`);
        }

        const updated: Video = {
            ...existing,
            ...updates,
            updatedAt: new Date(),
        };

        await db.put('media', updated);
    }

    // Delete video
    static async deleteVideo(id: string): Promise<void> {
        const db = await getDB();
        await db.delete('media', id);
    }


}