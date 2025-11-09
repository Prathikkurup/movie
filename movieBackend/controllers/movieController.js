const pool = require('../config/db');

exports.getMovies = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                m.id, 
                m.title, 
                m.description, 
                m.genre, 
                m.duration_min,
                (SELECT json_agg(
                    json_build_object(
                        'id', s.id,
                        'start_time', s.start_time, 
                        'ticket_price', s.ticket_price,
                        'theatre_name', t.name
                    )
                ) 
                FROM showtimes s
                JOIN theatres t ON s.theatre_id = t.id
                WHERE s.movie_id = m.id) AS showtimes
            FROM movies m;`
        );
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Server error fetching movie data' });
    }
};

exports.getShowtimeSeats = async (req, res) => {
    const { showtimeId } = req.params; 

    try {
        const showtimeQuery = 'SELECT theatre_id FROM showtimes WHERE id = $1'; 
        const { rows: showtimeRows } = await pool.query(showtimeQuery, [showtimeId]); 

        if (showtimeRows.length === 0) {
            return res.status(404).json({ msg: 'Showtime not found.' });
        }
        const theatreId = showtimeRows[0].theatre_id;

        const seatsQuery = `
            SELECT 
                s.id,
                s.seat_row,               
                s.seat_number,            
                CASE
                    WHEN bs.seat_id IS NOT NULL THEN TRUE
                    ELSE FALSE
                END AS is_booked
            FROM seats s
            LEFT JOIN booked_seats bs 
                ON s.id = bs.seat_id AND bs.showtime_id = $1
            WHERE s.theatre_id = $2
            ORDER BY s.seat_row, s.seat_number;
        `;
        
        const { rows: seats } = await pool.query(seatsQuery, [showtimeId, theatreId]);

        if (seats.length === 0) {
            return res.status(404).json({ msg: 'No seats found for this theatre.' });
        }

        res.json(seats);
        
    } catch (error) {
        console.error('Error fetching seats by showtime:', error);
        res.status(500).json({ msg: 'Server error fetching seat availability.' });
    }
};