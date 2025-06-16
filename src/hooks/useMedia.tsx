import { useState, useEffect, useCallback } from 'react';
import { VideoService, type Video } from '../service/multimediaIDB';

export const useVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadVideos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const allVideos = await VideoService.getAllVideos();
            setVideos(allVideos);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load videos');
        } finally {
            setLoading(false);
        }
    }, []);


    const getVideo = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const video = await VideoService.getVideo(id);
            if (!video) {
                throw new Error(`Video with id ${id} not found`);
            }
            return video;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load video');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addVideo = useCallback(async (videoData: Parameters<typeof VideoService.createVideo>[0]) => {
        try {
            await VideoService.createVideo(videoData);
            await loadVideos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add video');
            throw err;
        }
    }, [loadVideos]);

    const updateVideo = useCallback(async (id: string, updates: Parameters<typeof VideoService.updateVideo>[1]) => {
        try {
            await VideoService.updateVideo(id, updates);
            await loadVideos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update video');
            throw err;
        }
    }, [loadVideos]);

    const deleteVideo = useCallback(async (id: string) => {
        try {
            await VideoService.deleteVideo(id);
            await loadVideos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete video');
            throw err;
        }
    }, [loadVideos]);

    useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    return {
        videos,
        loading,
        error,
        getVideo,
        addVideo,
        updateVideo,
        deleteVideo,
        refresh: loadVideos,
    };
};