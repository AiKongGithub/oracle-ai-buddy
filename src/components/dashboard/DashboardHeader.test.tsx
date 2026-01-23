import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardHeader } from './DashboardHeader';
import { useUserStore } from '@/stores/useUserStore';

// Mock the stores
vi.mock('@/stores/useUserStore', () => ({
  useUserStore: vi.fn(),
}));

// Mock ThemeToggle
vi.mock('@/components/theme', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme</button>,
}));

describe('DashboardHeader', () => {
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('When not authenticated', () => {
    beforeEach(() => {
      (useUserStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        user: null,
        isAuthenticated: false,
        signOut: mockSignOut,
      });
    });

    it('should render logo', () => {
      render(<DashboardHeader />);

      expect(screen.getByText('🐉')).toBeInTheDocument();
      expect(screen.getByText('Oracle AI Buddy')).toBeInTheDocument();
    });

    it('should render login button', () => {
      render(<DashboardHeader />);

      expect(screen.getByText('เข้าสู่ระบบ')).toBeInTheDocument();
    });

    it('should show default greeting with "Buddy" name', () => {
      render(<DashboardHeader />);

      // Should greet with Buddy since user is null
      expect(screen.getByText(/Buddy!/)).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      render(<DashboardHeader />);

      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Chat' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Progress' })).toBeInTheDocument();
    });

    it('should render theme toggle', () => {
      render(<DashboardHeader />);

      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });
  });

  describe('When authenticated', () => {
    beforeEach(() => {
      (useUserStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        user: {
          id: 'user-1',
          name: 'สมชาย',
          email: 'somchai@example.com',
        },
        isAuthenticated: true,
        signOut: mockSignOut,
      });
    });

    it('should display user name in greeting', () => {
      render(<DashboardHeader />);

      expect(screen.getByText(/สมชาย!/)).toBeInTheDocument();
    });

    it('should display user initials in avatar', () => {
      render(<DashboardHeader />);

      expect(screen.getByText('สม')).toBeInTheDocument();
    });

    it('should display user name', () => {
      render(<DashboardHeader />);

      // User name appears in avatar area
      const userNames = screen.getAllByText('สมชาย');
      expect(userNames.length).toBeGreaterThan(0);
    });

    it('should display Buddy badge', () => {
      render(<DashboardHeader />);

      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    it('should render logout button', () => {
      render(<DashboardHeader />);

      expect(screen.getByText('ออกจากระบบ')).toBeInTheDocument();
    });

    it('should call signOut when logout button is clicked', () => {
      render(<DashboardHeader />);

      const logoutButton = screen.getByText('ออกจากระบบ');
      fireEvent.click(logoutButton);

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('Mobile Menu', () => {
    beforeEach(() => {
      (useUserStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        user: null,
        isAuthenticated: false,
        signOut: mockSignOut,
      });
    });

    it('should render mobile menu button', () => {
      render(<DashboardHeader />);

      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();
    });

    it('should show ☰ icon when menu is closed', () => {
      render(<DashboardHeader />);

      expect(screen.getByText('☰')).toBeInTheDocument();
    });

    it('should show ✕ icon when menu is open', () => {
      render(<DashboardHeader />);

      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('should show mobile navigation when menu is open', () => {
      render(<DashboardHeader />);

      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      expect(screen.getByText('📊 Dashboard')).toBeInTheDocument();
      expect(screen.getByText('💬 Chat')).toBeInTheDocument();
      expect(screen.getByText('📈 Progress')).toBeInTheDocument();
    });

    it('should show mobile login link when not authenticated', () => {
      render(<DashboardHeader />);

      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      expect(screen.getByText('🔐 เข้าสู่ระบบ')).toBeInTheDocument();
    });

    it('should show mobile logout button when authenticated', () => {
      (useUserStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        user: { id: '1', name: 'Test' },
        isAuthenticated: true,
        signOut: mockSignOut,
      });

      render(<DashboardHeader />);

      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      expect(screen.getByText('🚪 ออกจากระบบ')).toBeInTheDocument();
    });

    it('should close mobile menu when link is clicked', () => {
      render(<DashboardHeader />);

      // Open menu
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      // Click a link
      const dashboardLink = screen.getByText('📊 Dashboard');
      fireEvent.click(dashboardLink);

      // Menu should be closed (back to ☰ icon)
      expect(screen.getByText('☰')).toBeInTheDocument();
    });
  });

  describe('Greeting based on time', () => {
    beforeEach(() => {
      (useUserStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        user: null,
        isAuthenticated: false,
        signOut: mockSignOut,
      });
    });

    it('should render welcome message', () => {
      render(<DashboardHeader />);

      expect(screen.getByText('พร้อมเรียนรู้ AI ไปด้วยกันวันนี้ไหมครับ?')).toBeInTheDocument();
    });

    it('should include wave emoji in greeting', () => {
      render(<DashboardHeader />);

      expect(screen.getByText(/👋/)).toBeInTheDocument();
    });
  });
});
