import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { notificationService } from '@/services/notificationService';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';

// Mock dependencies
vi.mock('@/services/notificationService', () => ({
    notificationService: {
        getNotifications: vi.fn(),
        markAsRead: vi.fn(),
        markAllAsRead: vi.fn()
    }
}));

// Mock formatDistanceToNow from date-fns
vi.mock('date-fns', () => ({
    formatDistanceToNow: () => '5 mins ago'
}));

const renderWithProviders = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <ThemeProvider>
                {component}
            </ThemeProvider>
        </BrowserRouter>
    );
};

describe('AdminNavbar Notifications', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and displays notifications', async () => {
        const mockNotifications = [
            { _id: '1', type: 'new-lead', title: 'Test Lead', message: 'Test Message', read: false, createdAt: new Date().toISOString() }
        ];

        (notificationService.getNotifications as any).mockResolvedValue({
            success: true,
            data: mockNotifications,
            meta: { unreadCount: 1 }
        });

        renderWithProviders(<AdminNavbar />);

        await waitFor(() => {
            expect(notificationService.getNotifications).toHaveBeenCalled();
        });

        const bell = screen.getByTestId('notification-bell');
        fireEvent.click(bell);

        expect(screen.getByText('Test Lead')).toBeInTheDocument();
    });

    it('handles mark as read interaction', async () => {
        const mockNotifications = [
            { _id: '1', type: 'new-lead', title: 'Test Lead', message: 'Test Message', read: false, createdAt: new Date().toISOString() }
        ];

        (notificationService.getNotifications as any).mockResolvedValue({
            success: true,
            data: mockNotifications,
            meta: { unreadCount: 1 }
        });
        (notificationService.markAsRead as any).mockResolvedValue({ success: true });

        renderWithProviders(<AdminNavbar />);

        await waitFor(() => {
            expect(notificationService.getNotifications).toHaveBeenCalled();
        });

        const bell = screen.getByTestId('notification-bell');
        fireEvent.click(bell);

        const markReadBtn = screen.getByText('Mark read');
        fireEvent.click(markReadBtn);

        await waitFor(() => {
            expect(notificationService.markAsRead).toHaveBeenCalledWith('1');
        });
    });
});
