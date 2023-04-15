import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const getAppInfo = async () => {
  const token = getToken();
  try {
    const { data } = await client("/admin/app-info", {
      //only admin can do this job
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


export const getMostRatedMovies = async () => {
    const token = getToken();
    try {
      const { data } = await client("/admin/most-rated", {
        //only admin can do this job
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