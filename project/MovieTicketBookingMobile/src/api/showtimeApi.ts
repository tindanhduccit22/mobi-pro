import client from "./client";

export interface Showtime {
    showtimeID: number;
    movieID: number;
    movieTitle: string;

    roomID: number;
    roomName: string;

    cinemaName: string;

    startTime: string;
    endTime: string;

    price: number;

    format: string;

    availableSeats: number;
}


// Get all showtimes for one movie
export const getShowtimesByMovie = async (
    movieId: number
): Promise<Showtime[]> => {

    const response = await client.get(
        `/Showtimes/movie/${movieId}`
    );

    return response.data;
};


// Get one showtime
export const getShowtimeById = async (
    showtimeId: number
): Promise<Showtime> => {

    const response = await client.get(
        `/Showtimes/${showtimeId}`
    );

    return response.data;
};