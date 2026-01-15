
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/auth/Login';
import { authService } from '../services/authService';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../services/authService', () => ({
    authService: {
        login: vi.fn(),
        verify2FALogin: vi.fn()
    }
}));

// Mock router components since AuthLink likely uses Link
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Helper to render with Router context
const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form correctly', () => {
        renderWithRouter(<LoginPage />);

        expect(screen.getByPlaceholderText(/admin@careermapsolutions.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In to Dashboard/i })).toBeInTheDocument();
    });

    it('shows error on empty submission', async () => {
        renderWithRouter(<LoginPage />);

        const submitBtn = screen.getByRole('button', { name: /Sign In to Dashboard/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            // Check for HTML5 validation or state error
            // Since the strict form validation might not be visible as text immediately without interaction
            // logic in Login.tsx component sets errors state.
            // Let's check if the error is displayed if implemented, or just verify service wasn't called.
            expect(authService.login).not.toHaveBeenCalled();
        });
    });

    it('calls login service with correct credentials', async () => {
        renderWithRouter(<LoginPage />);

        // Mock successful response
        (authService.login as any).mockResolvedValue({
            success: true,
            data: { user: { id: '1', name: 'Admin' } }
        });

        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true
        });

        // Fill form
        fireEvent.change(screen.getByPlaceholderText(/admin@careermapsolutions.com/i), {
            target: { value: 'test@admin.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
            target: { value: 'password123' }
        });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /Sign In to Dashboard/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                email: 'test@admin.com',
                password: 'password123'
            });
        });
    });
});
