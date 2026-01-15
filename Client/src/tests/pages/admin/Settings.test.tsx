import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../../../pages/admin/Settings';
import { adminService } from '../../../services/adminService';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import { SettingsProvider } from '../../../context/SettingsContext';
import { ThemeProvider } from '../../../context/ThemeContext';

vi.mock('../../../components/layout/AdminLayout', () => ({
    AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock services
vi.mock('../../../services/adminService', () => ({
    adminService: {
        getSystemSettings: vi.fn(),
        getSystemLogs: vi.fn(),
        getDatabaseStats: vi.fn(),
    }
}));

// Mock AuthContext
vi.mock('../../../context/AuthContext', async () => {
    const actual = await vi.importActual('../../../context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            user: { firstName: 'Admin', role: 'super_admin' }, // super_admin to see logs delete
            isSuperAdmin: true,
            token: 'valid-token',
            loading: false
        })
    };
});

describe('Settings Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // deprecated
                removeListener: vi.fn(), // deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
        (adminService.getSystemSettings as any).mockResolvedValue({
            success: true,
            data: {
                siteName: 'Test Site',
                siteDescription: 'Desc',
                contactEmail: '',
                contactPhone: '',
                maintenanceMode: false,
                allowRegistrations: true,
                emailNotifications: true,
                notificationAlerts: {},
                maxFileSize: 10,
                allowedFileTypes: [],
                smtp: {},
                socialMedia: {}
            }
        });
        (adminService.getDatabaseStats as any).mockResolvedValue({
            success: true,
            data: { collections: 0, documents: 0, size: '0 B' }
        });
        (adminService.getSystemLogs as any).mockResolvedValue({
            success: true,
            data: [],
            meta: { pagination: { total: 0, pages: 1, page: 1, limit: 20 } }
        });
    });

    it.skip('loads default system tab when no url param', async () => {
        render(
            <MemoryRouter initialEntries={['/admin/settings']}>
                <AuthProvider>
                    <ThemeProvider>
                        <SettingsProvider>
                            <Settings />
                        </SettingsProvider>
                    </ThemeProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Platform Name')).toBeInTheDocument(); // System tab content
        });
    });

    it.skip('loads logs tab when url param is set', async () => {
        render(
            <MemoryRouter initialEntries={['/admin/settings?tab=logs']}>
                <AuthProvider>
                    <ThemeProvider>
                        <SettingsProvider>
                            <Settings />
                        </SettingsProvider>
                    </ThemeProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('System Logs')).toBeInTheDocument();
            expect(adminService.getSystemLogs).toHaveBeenCalled();
        });
    });

    it.skip('switches tabs and updates URL', async () => {
        render(
            <MemoryRouter initialEntries={['/admin/settings']}>
                <AuthProvider>
                    <ThemeProvider>
                        <SettingsProvider>
                            <Settings />
                        </SettingsProvider>
                    </ThemeProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        const logsTab = screen.getByText('System Logs'); // The tab button label logic might be inside mapped tabs
        // In Settings.tsx: { id: 'logs', label: 'System Logs', icon: FileText }
        // The button text is "System Logs"

        fireEvent.click(logsTab);

        await waitFor(() => {
            expect(adminService.getSystemLogs).toHaveBeenCalled();
            // Verify URL update is tricky with MemoryRouter directly, 
            // usually we check if the content rendered.
            expect(screen.getByText('Timestamp')).toBeInTheDocument(); // Table header in Logs
        });
    });
});
