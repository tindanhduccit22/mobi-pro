import apiClient from "./client";


export interface Cinema {

    cinemaID:number;

    cinemaName:string;

    address:string;

    city:string;

    phone:string;

}



export const getAllCinemas = async():Promise<Cinema[]>=>{

    const response =
        await apiClient.get("/Cinemas");


    return response.data;

};