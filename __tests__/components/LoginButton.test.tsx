import { LoginButton } from '@components/LoginButton';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

describe('Login button', () => {
  it('renders loading', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: {},
      status: 'loading',
    });

    render(<LoginButton />);

    const loading = screen.getByText('Loading...');

    expect(loading).toBeInTheDocument();
  });

  it('renders the login when authenticated', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: {
        user: {
          username: 'test',
        },
      },
      status: 'authenticated',
    });

    render(<LoginButton />);

    const title = screen.getByText('Take me there!');

    expect(title).toBeInTheDocument();
  });

  it('renders the login when not authenticated', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: {},
      status: 'unauthenticated',
    });

    render(<LoginButton />);

    const title = screen.getByText('Take me there!');

    expect(title).toBeInTheDocument();
  });
});
