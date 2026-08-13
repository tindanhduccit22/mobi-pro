import client from "./client";



export interface Ticket {

    bookingID:number;

    userID:number;

    userName:string;

    showtimeID:number; 

    movieTitle:string;

    startTime:string;

    bookingCode:string;

    bookingDate:string;

    totalAmount:number;

    status:string;

    qrCode:string | null;

}






export interface CreateBookingRequest {


    userID:number;

    showtimeID:number;

    totalAmount:number;

    status:string;

    qRCode:string | null;

}







export interface UpdateBookingRequest {


    totalAmount:number;

    status:string;

    qRCode:string | null;


}







// GET BOOKING BY ID
export const getTicketById = async(
    bookingId:number
):Promise<Ticket>=>{


    const response =
        await client.get(
            `/Bookings/${bookingId}`
        );


    return response.data;


};









// CREATE BOOKING

export const createBooking = async(
    data:CreateBookingRequest
)=>{


    const response =
        await client.post(
            "/Bookings",
            data
        );


    return response.data;


};









// UPDATE BOOKING (save QR code)

export const updateBooking = async(
    bookingId:number,
    data:UpdateBookingRequest
)=>{


    const response =
        await client.put(
            `/Bookings/${bookingId}`,
            data
        );


    return response.data;


};