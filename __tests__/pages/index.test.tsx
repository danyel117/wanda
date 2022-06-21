import { render, screen } from '@testing-library/react';
import Home from '@pages/index';

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

describe('Home', () => {
  it('renders the title', () => {
    render(<Home />);

    const title = screen.getByText('Welcome to Wanda!');

    expect(title).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Home />);

    const title = screen.getByText('Think Aloud evaluations made easy');

    expect(title).toBeInTheDocument();
  });

  it('renders the how does it work button', () => {
    render(<Home />);

    const title = screen.getByText('How does it work?');

    expect(title).toBeInTheDocument();
  });

  it('renders the login', () => {
    render(<Home />);

    const title = screen.getByText('Take me there!');

    expect(title).toBeInTheDocument();
  });
});
