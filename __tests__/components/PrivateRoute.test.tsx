import { render, screen } from '@testing-library/react';
import PrivateRoute from '@components/PrivateRoute';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: 'admin' },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => ({ data: mockSession, status: 'authenticated' })),
  };
});

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe('PrivateRoute', () => {
  it('renders loading', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: {},
      status: 'loading',
    });

    render(
      <PrivateRoute rejected={false} isPublic={false}>
        <div>Private route</div>
      </PrivateRoute>
    );

    const loading = screen.getByText('Loading...');

    expect(loading).toBeInTheDocument();
  });

  it('renders a public page', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: {},
      status: 'unauthenticated',
    });

    render(
      <PrivateRoute rejected={false} isPublic>
        <div>Public route</div>
      </PrivateRoute>
    );

    const pr = screen.getByText('Public route');

    expect(pr).toBeInTheDocument();
  });

  it('renders a private page', () => {
    render(
      <PrivateRoute rejected={false} isPublic={false}>
        <div>Private route</div>
      </PrivateRoute>
    );

    const pr = screen.getByText('Private route');

    expect(pr).toBeInTheDocument();
  });

  it('renders unatuhorized', () => {
    render(
      <PrivateRoute rejected isPublic={false}>
        <div>Private route</div>
      </PrivateRoute>
    );

    const pr = screen.getByText(/You are not authorized to view this page/i);

    expect(pr).toBeInTheDocument();
  });
});
