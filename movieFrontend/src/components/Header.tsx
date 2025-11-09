import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Film, History, LogOut, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
}

export const Header = ({ showBackButton = false }: HeaderProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex flex-1 items-center gap-4">
          {showBackButton ? (
            <Button variant="ghost" size="icon" onClick={() => navigate('/movies')}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Movies</span>
            </Button>
          ) : (
            <Link to="/movies" className="flex items-center gap-2 font-semibold text-lg">
              <Film className="h-6 w-6 text-primary" />
              <span>CineBook</span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:inline">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/movies')}
            className="gap-2"
          >
            <Film className="h-4 w-4" />
            <span className="hidden sm:inline">Browse Movies</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/bookings')}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">My Bookings</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
