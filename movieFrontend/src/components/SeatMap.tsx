import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Armchair } from 'lucide-react';

interface Seat {
  id: number;
  seat_row: string;
  seat_number: number;
  is_booked: boolean;
}

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: number[];
  onSeatSelect: (seatId: number) => void;
}

export const SeatMap = ({ seats, selectedSeats, onSeatSelect }: SeatMapProps) => {
  // Group seats by row for rendering
  const seatsByRow = seats.reduce((acc, seat) => {
    (acc[seat.seat_row] = acc[seat.seat_row] || []).push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Screen */}
      <div className="w-full h-2 bg-foreground/20 rounded-b-full shadow-inner" />

      {/* Seats */}
      <div className="space-y-3">
        {Object.entries(seatsByRow).map(([row, seatsInRow]) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-4 text-sm font-semibold text-muted-foreground">{row}</span>
            <div className="flex gap-2">
              {seatsInRow.map((seat) => (
                <motion.button
                  key={seat.id} // <-- THE FIX: Add a unique key for each seat
                  whileHover={{ scale: seat.is_booked ? 1 : 1.1 }}
                  whileTap={{ scale: seat.is_booked ? 1 : 0.95 }}
                  onClick={() => !seat.is_booked && onSeatSelect(seat.id)}
                  disabled={seat.is_booked}
                  className={cn(
                    "p-1 rounded-md transition-colors",
                    {
                      "bg-success/20 text-success-foreground border border-success cursor-pointer hover:bg-success/40": !seat.is_booked,
                      "bg-muted text-muted-foreground cursor-not-allowed": seat.is_booked,
                      "bg-primary text-primary-foreground ring-2 ring-primary-focus": selectedSeats.includes(seat.id),
                    }
                  )}
                >
                  <Armchair className="h-5 w-5" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-success/20 border border-success" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};