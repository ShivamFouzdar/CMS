import React, { useState, useEffect } from 'react';
import { mediaService, MediaItem } from '@/services/mediaService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

interface MediaLibraryProps {
    onSelect?: (media: MediaItem) => void;
    selectionMode?: boolean; // If true, acts as a picker. If false, acts as a manager.
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
    onSelect,
    selectionMode = false,
}) => {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchMedia();
    }, [page, refreshTrigger]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const response = await mediaService.getMedia(page, 20); // Limit 20
            setMedia(response.data);
            setTotalPages(response.pagination.pages);
        } catch (error) {
            console.error('Failed to load media', error);
            // toast.error('Failed to load media');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            // Loop if multiple (but backend might only handle single for now as per my route)
            // Route is `uploadGeneric.single('file')`. So one by one.
            for (let i = 0; i < files.length; i++) {
                await mediaService.uploadMedia(files[i]);
            }
            setRefreshTrigger(prev => prev + 1);
            setPage(1); // Reset to first page to see new uploads
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
            // clear input
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent selection
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            await mediaService.deleteMedia(id);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Delete failed', error);
            alert('Delete failed');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Media Library</h2>
                <div>
                    <label htmlFor="media-upload" className="cursor-pointer">
                        <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            {uploading ? 'Uploading...' : 'Upload New'}
                        </span>
                        <input
                            id="media-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept="image/*,application/pdf"
                            multiple
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {loading && media.length === 0 ? (
                <div className="flex justify-center p-10"><LoadingSpinner size="lg" /></div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {media.map((item) => (
                            <div
                                key={item._id}
                                className={`group relative border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${selectionMode ? 'hover:ring-2 hover:ring-indigo-500' : ''}`}
                                onClick={() => selectionMode && onSelect && onSelect(item)}
                            >
                                <div className="aspect-w-10 aspect-h-7 bg-gray-100 flex items-center justify-center h-32 overflow-hidden">
                                    {item.type === 'image' ? (
                                        <img src={item.url} alt={item.fileName} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="text-gray-500 flex flex-col items-center p-4 text-center">
                                            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            <span className="text-xs truncate w-full">{item.format}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-2 text-xs">
                                    <p className="font-medium truncate text-gray-900" title={item.fileName}>{item.fileName}</p>
                                    <p className="text-gray-500 mt-0.5">{(item.size / 1024).toFixed(1)} KB</p>
                                </div>

                                {!selectionMode && (
                                    <button
                                        onClick={(e) => handleDelete(item._id, e)}
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-opacity"
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {media.length === 0 && !loading && (
                        <div className="text-center py-10 text-gray-500">No media files found. Upload some!</div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
