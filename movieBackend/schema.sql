-- Drop all tables if they exist, in an order that respects dependencies, using CASCADE for simplicity.
-- This allows the script to be re-run without errors.
DROP TABLE IF EXISTS booked_seats CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS showtimes CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS theatres CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table 1: users (Secure Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: movies
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    duration_min INTEGER NOT NULL
);

-- Table 3: theatres
CREATE TABLE theatres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255)
);

-- Table 4: seats (All physical seats in a theatre)
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    theatre_id INTEGER REFERENCES theatres(id),
    seat_row CHAR(1) NOT NULL,
    seat_number INTEGER NOT NULL,
    UNIQUE (theatre_id, seat_row, seat_number)
);

-- Table 5: showtimes (Links movies to theatres and times)
CREATE TABLE showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    theatre_id INTEGER REFERENCES theatres(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    ticket_price NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    UNIQUE (theatre_id, start_time)
);

-- Table 6: bookings (The main transaction record)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    showtime_id INTEGER REFERENCES showtimes(id) ON DELETE CASCADE,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_price NUMERIC(6, 2) NOT NULL
);

-- Table 7: booked_seats (The critical availability table)
CREATE TABLE booked_seats (
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    seat_id INTEGER REFERENCES seats(id) ON DELETE CASCADE,
    showtime_id INTEGER REFERENCES showtimes(id) ON DELETE CASCADE,
    PRIMARY KEY (booking_id, seat_id),
    UNIQUE (showtime_id, seat_id) -- THIS PREVENTS DOUBLE BOOKING!
);-- 1. Insert Theatres (REPEATED FROM BEFORE)
INSERT INTO theatres (name, location) VALUES
('Cinema Hall 1', 'City Center Mall'),
('Grand Theatre', 'Downtown West'),
('Cineplex Prime', 'East Side Plaza'),
('The Vintage Reel', 'Old Town District');


-- 2. Insert 8 Movies (Expanded List)
INSERT INTO movies (title, description, genre, duration_min) VALUES
('The Galactic Drift', 'A sci-fi epic about a lone traveler saving the universe from a black hole.', 'Sci-Fi', 150),
('Love in Paris', 'A romantic comedy set against the backdrop of the Eiffel Tower.', 'Romance', 110),
('Shadows of the City', 'A gritty detective thriller uncovering corruption in the metropolis.', 'Thriller', 135),
('A Family Recipe', 'A heartwarming drama about a struggling chef who rediscovers his passion.', 'Drama', 98),
('Codebreaker', 'Historical espionage film based on a true story of WWII intelligence.', 'History', 120),
('The Last Dragon', 'Animated fantasy adventure for the whole family.', 'Animation', 90),
('Mountain Quest', 'A documentary following climbers attempting an unclimbed peak.', 'Documentary', 105),
('Midnight Race', 'High-octane action film with illegal street racing and rival gangs.', 'Action', 115);


-- 3. Insert Seats for Theatre 1 (50 seats)
-- This script now seeds 50 seats for EACH of the 4 theatres.
DO $$
DECLARE
    row_char CHAR(1);
    seat_num INTEGER;
    theatre_id_to_seed INTEGER;
BEGIN
    FOR theatre_id_to_seed IN 1..4 LOOP
        FOR row_char IN SELECT chr(i) FROM generate_series(ascii('A'), ascii('E')) AS i LOOP
            FOR seat_num IN 1..10 LOOP
                INSERT INTO seats (theatre_id, seat_row, seat_number) VALUES (theatre_id_to_seed, row_char, seat_num);
            END LOOP;
        END LOOP;
    END LOOP;
END $$;


-- 4. Insert Showtimes (Linking Movies to Theatres)
-- Note: We use the IDs 1 through 8 for the movies inserted above.
INSERT INTO showtimes (movie_id, theatre_id, start_time, ticket_price) VALUES
-- Movie 1: The Galactic Drift (Theatre 1)
(1, 1, '2025-11-10 18:00:00+05:30', 12.50), -- Showtime ID 1
(1, 1, '2025-11-10 21:30:00+05:30', 14.00), -- Showtime ID 2

-- Movie 2: Love in Paris (Theatre 2)
(2, 2, '2025-11-11 15:00:00+05:30', 10.00), -- Showtime ID 3

-- Movie 3: Shadows of the City (Theatre 3)
(3, 3, '2025-11-10 19:30:00+05:30', 13.00), -- Showtime ID 4

-- Movie 4: A Family Recipe (Theatre 4)
(4, 4, '2025-11-11 14:00:00+05:30', 9.50), -- Showtime ID 5

-- Movie 5: Codebreaker (Theatre 1)
(5, 1, '2025-11-11 11:00:00+05:30', 11.00), -- Showtime ID 6

-- Movie 6: The Last Dragon (Theatre 3)
(6, 3, '2025-11-10 16:00:00+05:30', 10.50), -- Showtime ID 7

-- Movie 7: Mountain Quest (Theatre 2)
(7, 2, '2025-11-12 18:00:00+05:30', 12.00), -- Showtime ID 8

-- Movie 8: Midnight Race (Theatre 4)
(8, 4, '2025-11-11 22:00:00+05:30', 14.50); -- Showtime ID 9    this was the sql qurery i used .. now give me the  solution to the error , colum mismatch or anything 