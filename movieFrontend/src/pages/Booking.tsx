import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { SeatMap } from '@/components/SeatMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { Loader2, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface Seat {
  id: number;
  seat_row: string;
  seat_number: number;
  is_booked: boolean;
}

const Booking = () => {
  const { showtimeId } = useParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(10); // Default price
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchSeats();
  }, [isAuthenticated, showtimeId, navigate]);

  const fetchSeats = async () => {
    try {
      const response = await api.get(`/movies/${showtimeId}/seats`);
      setSeats(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load seats",
        variant: "destructive",
      });
      navigate('/movies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeatSelect = (seatId: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const response = await api.post('/bookings', {
        showtimeId: Number(showtimeId),
        seatIds: selectedSeats,
      });

      toast({
        title: "Booking Successful",
        description: `Booking ID: ${response.data.bookingId}. Total: $${response.data.totalPrice}`,
      });

      navigate('/bookings');
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Handle seat conflict
        const conflictMessage = error.response?.data?.message || "Some seats are no longer available";
        toast({
          title: "Booking Conflict",
          description: conflictMessage,
          variant: "destructive",
        });
        // Refresh seat data
        fetchSeats();
        setSelectedSeats([]);
      } else {
        toast({
          title: "Booking Failed",
          description: error.response?.data?.message || "Failed to complete booking",
          variant: "destructive",
        });
      }
    } finally {
      setIsBooking(false);
    }
  };

  const totalPrice = selectedSeats.length * ticketPrice;

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
      <Header showBackButton={true} />
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Select Your Seats</h1>
          <p className="text-muted-foreground">
            Choose your preferred seats for the show
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Seat Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <SeatMap
                  seats={seats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Selected Seats</span>
                    <span className="font-semibold">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per Ticket</span>
                    <span className="font-semibold">${ticketPrice}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-primary">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleBooking}
                  className="w-full shadow-md hover:shadow-lg"
                  disabled={selectedSeats.length === 0 || isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>

                {selectedSeats.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground">
                    Please select at least one seat
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
