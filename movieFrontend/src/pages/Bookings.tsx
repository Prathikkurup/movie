import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { BookingCard } from '@/components/BookingCard';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookingDetails {
  id: number;
  movie_title: string;
  start_time: string;
  theatre_name: string;
  total_price: number;
  seats: string[];
}

const Bookings = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    setCancellingId(bookingId);

    try {
      await api.delete(`/bookings/${bookingId}`);
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully",
      });

      // Remove the cancelled booking from the list
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.response?.data?.message || "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your movie bookings
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground mb-4">No bookings found</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/movies')}
              className="text-primary hover:underline"
            >
              Browse Movies →
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:gap-8 max-w-3xl">
            {bookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                isCancelling={cancellingId === booking.id}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookings;
