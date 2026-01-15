
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAuthHeaders } from '../utils/apiHelpers';

describe('apiHelpers', () => {
    beforeEach(() => {
        vi.unstubAllGlobals();
        localStorage.clear();
    });

    describe('getAuthHeaders', () => {
        it('should return authorization header when token exists', () => {
            const token = 'fake-token-123';
            localStorage.setItem('accessToken', token);

            const headers = getAuthHeaders();
            expect(headers).toEqual({ Authorization: `Bearer ${token}` });
        });

        it('should throw error when token is missing', () => {
            expect(() => getAuthHeaders()).toThrow('No access token found');
        });
    });
});
