import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobApplicants from '../../../pages/admin/JobApplicants';
import { jobApplicationService } from '../../../services/jobApplicationService';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import { SettingsProvider } from '../../../context/SettingsContext';
import { ThemeProvider } from '../../../context/ThemeContext';

vi.mock('../../../components/layout/AdminLayout', () => ({
    AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock services
vi.mock('../../../services/jobApplicationService', () => ({
    jobApplicationService: {
        getAllApplications: vi.fn(),
        exportApplications: vi.fn(),
    }
}));

// Mock AuthContext
vi.mock('../../../context/AuthContext', async () => {
    const actual = await vi.importActual('../../../context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            user: { firstName: 'Admin', role: 'admin' },
            token: 'valid-token',
            loading: false
        })
    };
});

// Wrapper
const renderWithProviders = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider>
                    <SettingsProvider>
                        {component}
                    </SettingsProvider>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('JobApplicants Page', () => {
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
    });

    const mockApplicants = [
        {
            _id: '1',
            fullName: 'Jane Doe',
            email: 'jane@example.com',
            phone: '1234567890',
            experience: '5 years',
            coverLetter: 'Hello',
            resumeValues: [],
            status: 'pending',
            createdAt: new Date().toISOString()
        }
    ];

    it.skip('renders applicants table with data', async () => {
        (jobApplicationService.getAllApplications as any).mockResolvedValue({
            data: mockApplicants,
            meta: { pagination: { total: 1, pages: 1, page: 1, limit: 10 } }
        });

        renderWithProviders(<JobApplicants />);

        await waitFor(() => {
            expect(screen.getByText('Jane Doe')).toBeInTheDocument();
            expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        });
    });

    it.skip('calls search API on typing', async () => {
        (jobApplicationService.getAllApplications as any).mockResolvedValue({
            data: [],
            meta: { pagination: { total: 0, pages: 0, page: 1, limit: 10 } }
        });

        renderWithProviders(<JobApplicants />);

        const searchInput = screen.getByPlaceholderText(/Search applicants/i);
        fireEvent.change(searchInput, { target: { value: 'Jane' } });

        // Debounce wait
        await waitFor(() => {
            expect(jobApplicationService.getAllApplications).toHaveBeenCalledWith(
                expect.objectContaining({ search: 'Jane' })
            );
        }, { timeout: 1000 });
    });

    it.skip('triggers export on button click', async () => {
        (jobApplicationService.getAllApplications as any).mockResolvedValue({
            data: [],
            meta: { pagination: { total: 0, pages: 0, page: 1, limit: 10 } }
        });
        (jobApplicationService.exportApplications as any).mockResolvedValue(new Blob(['data'], { type: 'text/csv' }));

        // Mock URL.createObjectURL
        global.URL.createObjectURL = vi.fn(() => 'blob:url');
        global.URL.revokeObjectURL = vi.fn();

        renderWithProviders(<JobApplicants />);

        const exportBtn = screen.getByText('Export CSV');
        fireEvent.click(exportBtn);

        await waitFor(() => {
            expect(jobApplicationService.exportApplications).toHaveBeenCalled();
            expect(global.URL.createObjectURL).toHaveBeenCalled();
        });
    });
});
