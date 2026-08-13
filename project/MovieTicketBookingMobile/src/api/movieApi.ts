import apiClient from "./client";

export interface Movie {
  movieID: number;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  language: string;
  country: string;
  director: string;
  cast: string;
  posterURL: string;
  bannerURL: string;
  trailerURL: string;
  ageRating: string;
  status: string;
  genreName: string;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  const response = await apiClient.get("/Movies");
  return response.data;
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await apiClient.get(`/Movies/${id}`);
  return response.data;
};

export const searchMovies = async (keyword: string): Promise<Movie[]> => {
  const response = await apiClient.get("/Movies/search", {
    params: { keyword },
  });

  return response.data;
};

export const getMoviesByGenre = async (
  genreId: number
): Promise<Movie[]> => {
  const response = await apiClient.get(`/Movies/genre/${genreId}`);
  return response.data;
};