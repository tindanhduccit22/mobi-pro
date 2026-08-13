import client from "./client";


export interface BookingDetail {

    bookingDetailID: number;

    bookingID: number;

    bookingCode: string;

    seatID: number;

    seatNumber: string;

    price: number;
}


// Get booking details
export const getBookingDetailsByBooking = async (
    bookingId: number
): Promise<BookingDetail[]> => {

    const response = await client.get(
        `/BookingDetails/booking/${bookingId}`
    );

    return response.data;
};


// Create booking detail
export const createBookingDetail = async (
    data: {
        bookingID: number;
        seatID: number;
        price: number;
    }
) => {

    const response = await client.post(
        "/BookingDetails",
        data
    );

    return response.data;
};