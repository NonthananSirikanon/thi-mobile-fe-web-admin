import { Button } from "antd";
import UploadBanner from "../components/ui/banner_upload";
import TextAreaInput from "../components/ui/textArea";
import TextInput from "../components/ui/textInput";
import BannerToggle from "../components/ui/switch";
import { useFormik } from "formik";
import { useVideos } from "../hooks/useMedia";

type FormValues = {
    thumbnail: File | null;
    videoFileName: string;
    videoUrl: string;
    description: string;
    isActive: boolean;
};

const validateForm = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    // Thumbnail validation
    if (!values.thumbnail) {
        errors.thumbnail = 'Thumbnail is required';
    }

    // Video file name validation
    if (!values.videoFileName) {
        errors.videoFileName = 'Required';
    } else if (!/^[\w\s\-\.\u4e00-\u9fff\u0e00-\u0e7f]{1,100}$/.test(values.videoFileName)) {
        errors.videoFileName = 'Invalid file name (no special characters, max 100 chars)';
    }

    // Video URL validation
    if (!values.videoUrl) {
        errors.videoUrl = 'Required';
    } else {
        try {
            new URL(values.videoUrl);
            if (/[<>"'`]/.test(values.videoUrl)) {
                errors.videoUrl = 'URL contains invalid characters';
            }
        } catch {
            errors.videoUrl = 'Invalid URL';
        }
    }

    // Description validation
    if (!values.description) {
        errors.description = 'Required';
    } else if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(values.description)) {
        errors.description = 'Description contains forbidden content';
    }

    return errors;
};

const MultimediaTable: React.FC = () => {
    const { addVideo, loading, error } = useVideos();

    const formik = useFormik({
        initialValues: {
            thumbnail: null,
            videoFileName: '',
            videoUrl: '',
            description: '',
            isActive: true,
        },
        validate: validateForm,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // Convert thumbnail file to Blob if it exists
                if (!values.thumbnail) {
                    throw new Error('Thumbnail is required');
                }
                const thumbnailFile = values.thumbnail as File;

                // Create video data matching the database schema
                const videoData = {
                    thumbnail: thumbnailFile, // This should be a Blob
                    status: values.isActive,
                    videoFileName: values.videoFileName,
                    videoUrl: values.videoUrl, // Using videoUrl as position for now
                    readingVolume: 0, // Default value
                    createdBy: 'current-user', // You should replace this with actual user info
                    lastEditedBy: 'current-user', // You should replace this with actual user info
                    position: 0,
                    publish: 'test', // Default value
                };

                await addVideo(videoData);

                // Reset form on successful submission
                resetForm();

                // Show success message
                console.log('Video uploaded successfully!');

            } catch (error) {
                console.error('Failed to upload video:', error);
            } finally {
                setSubmitting(false);
            }
        },
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="*:mt-4">

                {/* TODO Clear upload file after submit */}
                <UploadBanner
                    id="thumbnail"
                    name="thumbnail"
                    title="Thumbnail"
                    required={true}
                    maxSize={10}
                    supportedFormats={["jpg", "jpeg", "png", "svg"]}
                    onFileChange={(files) => {
                        console.log("ไฟล์ที่เลือก:", files);
                        if (files && files.length > 0) {
                            formik.setFieldValue('thumbnail', files[0]);
                        }
                    }}
                />
                <div className="flex flex-col gap-4 md:flex-row md:gap-4">
                    <div className="flex-1">
                        <TextInput
                            id="videoFileName"
                            name="videoFileName"
                            label="Video File Name"
                            placeholder="Enter video File Name"
                            value={formik.values.videoFileName}
                            onChange={formik.handleChange}
                            error={formik.errors.videoFileName}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <TextInput
                            id="videoUrl"
                            name="videoUrl"
                            label="URL Video"
                            placeholder="https://www.youtube.com/watch?v=example"
                            value={formik.values.videoUrl}
                            onChange={formik.handleChange}
                            error={formik.errors.videoUrl}
                            required
                        />
                    </div>
                </div>
                <TextAreaInput id="description" name="description" onChange={formik.handleChange} value={formik.values.description} error={formik.errors.description} label="Description" placeholder="Describe your video..." required />
                <BannerToggle
                    id="isActive"
                    checked={formik.values.isActive}
                    onChange={checked => formik.setFieldValue('isActive', checked)}
                    showLabel={true}
                />
                <div className="flex justify-end gap-3 mt-4">
                    {error && (
                        <div className="text-red-500 text-sm mb-2 w-full">
                            Error: {error}
                        </div>
                    )}
                    <Button
                        color="red"
                        variant="outlined"
                        onClick={() => formik.resetForm()}
                        disabled={formik.isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={formik.isSubmitting || loading}
                        disabled={formik.isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default MultimediaTable;