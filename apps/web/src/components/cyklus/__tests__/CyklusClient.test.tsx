import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CyklusClient from '../CyklusClient';

jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));

const { useSession } = require('next-auth/react');

describe('CyklusClient', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    const store: Record<string, string> = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => { delete store[key]; });
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders tutorial progress panel for new players', async () => {
    render(<CyklusClient />);
    await waitFor(() => {
      expect(screen.getByText(/TUTORIAL 1 \/ 16/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Úvod/)).toBeInTheDocument();
  });
});
