import client from "./client";

export interface Seat {
    seatID: number;
    roomID: number;
    roomName: string;
    seatNumber: string;
    seatType: string;
    isActive: boolean;
}


// Get all seats in a room
export const getSeatsByRoom = async (
    roomId: number
): Promise<Seat[]> => {

    const response = await client.get(
        `/Seats/room/${roomId}`
    );

    return response.data;
};