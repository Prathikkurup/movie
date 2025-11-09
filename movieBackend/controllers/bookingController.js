const pool = require('../config/db'); 

exports.createBooking = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { showtimeId, seatIds } = req.body;
        const userId = req.user.id;

        if (!showtimeId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ msg: 'Invalid request: showtimeId and an array of seatIds are required.' });
        }
        const priceQuery = 'SELECT ticket_price FROM showtimes WHERE id = $1';
        const priceResult = await client.query(priceQuery, [showtimeId]);

        if (priceResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'Showtime not found.' });
        }

        const ticketPrice = parseFloat(priceResult.rows[0].ticket_price);
        const totalPrice = ticketPrice * seatIds.length;

        const bookedCheckQuery = `
            SELECT seat_id 
            FROM booked_seats
            WHERE showtime_id = $1 AND seat_id = ANY($2::int[])
            FOR UPDATE; 
        `;
        const { rows: alreadyBooked } = await client.query(bookedCheckQuery, [showtimeId, seatIds]);

        if (alreadyBooked.length > 0) {
            await client.query('ROLLBACK');
            const bookedSeatIds = alreadyBooked.map(row => row.seat_id);
            return res.status(409).json({
                msg: 'Booking failed: One or more selected seats are already taken.',
                bookedSeatIds: bookedSeatIds
            });
        }

        const bookingInsertQuery = `
            INSERT INTO bookings (user_id, showtime_id, total_price, booking_date)
            VALUES ($1, $2, $3, NOW())
            RETURNING id; 
        `;
        const { rows: bookingResult } = await client.query(bookingInsertQuery, [userId, showtimeId, totalPrice]);
        const bookingId = bookingResult[0].id;

        const bookedSeatsValues = seatIds.map((seatId) => {
            return `(${bookingId}, ${showtimeId}, ${parseInt(seatId, 10)})`;
        }).join(', ');

        const bookedSeatsInsertQuery = `
            INSERT INTO booked_seats (booking_id, showtime_id, seat_id)
            VALUES ${bookedSeatsValues};
        `;
        await client.query(bookedSeatsInsertQuery);

        await client.query('COMMIT');

        return res.status(201).json({
            msg: 'Booking created successfully',
            bookingId: bookingId,
            seatsBooked: seatIds.length,
            totalPrice: totalPrice,
            showtime: showtimeId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during booking transaction:', error);
        return res.status(500).json({ msg: 'Server error during booking process.' });
    } finally {
        client.release();
    }
};



exports.getBookingHistory = async (req, res) => {
    const userId = req.user.id;

    try {
        const bookingsQuery = `
            SELECT
                b.id,
                b.booking_date,
                b.total_price,
                s.start_time,
                s.ticket_price,
                m.title AS movie_title,
                t.name AS theatre_name,
                t.location AS theatre_location,
                s.id AS showtime_id
            FROM bookings b
            JOIN showtimes s ON b.showtime_id = s.id
            JOIN movies m ON s.movie_id = m.id
            JOIN theatres t ON s.theatre_id = t.id
            WHERE b.user_id = $1
            ORDER BY b.booking_date DESC;
        `;
        const { rows: bookings } = await pool.query(bookingsQuery, [userId]);

        if (bookings.length === 0) {
            return res.status(200).json({ msg: 'You have no active bookings.' });
        }

        const bookingIds = bookings.map(b => b.id);
        
        const seatsQuery = `
            SELECT 
                bs.booking_id AS id,
                s.seat_row,
                s.seat_number
            FROM booked_seats bs
            JOIN seats s ON bs.seat_id = s.id
            WHERE bs.booking_id = ANY($1::int[]);
        `;
        const { rows: bookedSeats } = await pool.query(seatsQuery, [bookingIds]);

        const bookingMap = {};
        bookings.forEach(booking => {
            booking.seats = [];
            bookingMap[booking.id] = booking;
        });

        bookedSeats.forEach(seat => {
            if (bookingMap[seat.id]) {
                bookingMap[seat.id].seats.push(`${seat.seat_row}${seat.seat_number}`);
            }
        });

        const bookingHistory = Object.values(bookingMap);

        res.status(200).json(bookingHistory);

    } catch (error) {
        console.error('Error fetching booking history:', error);
        res.status(500).json({ msg: 'Server error retrieving booking history.' });
    }
};

exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const authCheckQuery = 'SELECT id FROM bookings WHERE id = $1 AND user_id = $2';
        const { rows: bookingRows } = await client.query(authCheckQuery, [bookingId, userId]);

        if (bookingRows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'Booking not found or access denied.' });
        }

        const deleteSeatsQuery = 'DELETE FROM booked_seats WHERE booking_id = $1';
        await client.query(deleteSeatsQuery, [bookingId]);

        const deleteBookingQuery = 'DELETE FROM bookings WHERE id = $1';
        await client.query(deleteBookingQuery, [bookingId]);

        await client.query('COMMIT');

        res.status(200).json({ 
            msg: `Booking ID ${bookingId} cancelled successfully. Seats are now available.` 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during booking cancellation transaction:', error);
        res.status(500).json({ msg: 'Server error during booking cancellation.' });
    } finally {
        client.release();
    }
};