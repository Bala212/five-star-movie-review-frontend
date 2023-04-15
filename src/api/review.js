import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const addReview = async (movieId, reviewData) => {
  const token = getToken();
  try {
    const { data } = await client.post(`/review/add/${movieId}`, reviewData, {
      //user needs to be authenticated
      headers: {
        //to tell that we are authenticated and store the token inside auth header
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getReviewByMovie = async (movieId) => {
  try {
    const { data } = await client(`/review/get-reviews-by-movie/${movieId}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteReview = async (reviewId) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/review/${reviewId}`, {
      //user needs to be authenticated
      headers: {
        //to tell that we are authenticated and store the token inside auth header
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateReview = async (reviewId, reviewData) => {
  const token = getToken();
  try {
    const { data } = await client.patch(`/review/${reviewId}`, reviewData, {
      //user needs to be authenticated
      headers: {
        //to tell that we are authenticated and store the token inside auth header
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
