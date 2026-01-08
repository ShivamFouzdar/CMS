import { MediaLibrary } from '@/components/admin/MediaLibrary';

const AdminMediaPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
                <p className="text-gray-500">Manage your uploaded assets</p>
            </div>

            <MediaLibrary selectionMode={false} />
        </div>
    );
};

export default AdminMediaPage;
