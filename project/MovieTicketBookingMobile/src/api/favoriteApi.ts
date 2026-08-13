// src/api/favoriteApi.ts

import apiClient from "./client";


export interface Favorite {

  favoriteID:number;

  userID:number;

  userName:string;

  movieID:number;

  movieTitle:string;

  posterURL:string;

  genreName:string;

  duration:number;

  createdAt:string;

}



// Get all favorites of a user

export const getFavoritesByUser = async(
  userId:number
):Promise<Favorite[]>=>{


  const response =
    await apiClient.get(
      `/Favorites/user/${userId}`
    );


  return response.data;

};




// Add favorite

export const addFavorite = async(
  userID:number,
  movieID:number
)=>{


  const response =
    await apiClient.post(
      "/Favorites",
      {
        userID,
        movieID
      }
    );


  return response.data;

};




// Remove favorite

export const removeFavorite = async(
  favoriteID:number
)=>{


  const response =
    await apiClient.delete(
      `/Favorites/${favoriteID}`
    );


  return response.data;

};