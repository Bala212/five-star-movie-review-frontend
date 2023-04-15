import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/upload-trailer", formData, {
      //only admin can do this job
      headers: {
        //to tell that we are authenticated and store the token inside auth header
        authorization: "Bearer " + token,
        //to accept only multipart form data
        //whenever we want to upload files from inside our front end to inside our backend,
        //we need to first specifically set the header to multipart form data.
        "content-type": "multipart/form-data",
      },
      //to know the progress of upload!!

      //loaded will e how much data we uploaded and total will be the total size of the data
      onUploadProgress: ({ loaded, total }) => {
        //check if there is uploading going on?
        if (onUploadProgress)
          //get upload progress in percentage
          onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const uploadMovie = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/create", formData, {
      //only admin can do this job
      headers: {
        //to tell that we are authenticated and store the token inside auth header
        authorization: "Bearer " + token,
        //to accept only multipart form data
        //whenever we want to upload files from inside our front end to inside our backend,
        //we need to first specifically set the header to multipart form data.
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovies = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client(
      `/movie/movies?pageNo=${pageNo}&limit=${limit}`,
      {
        //only admin can do this job
        headers: {
          //to tell that we are authenticated and store the token inside auth header
          authorization: "Bearer " + token,
          //to accept only multipart form data
          //whenever we want to upload files from inside our front end to inside our backend,
          //we need to first specifically set the header to multipart form data.
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovieForUpdate = async (id) => {
  const token = getToken();
  try {
    // url's id is fetched by req.params
    const { data } = await client("/movie/for-update/" + id, {
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

export const updateMovie = async (id, formData) => {
  const token = getToken();
  try {
    // url's id is fetched by req.params
    const { data } = await client.patch("/movie/update/" + id, formData, {
      //only admin can do this job
      headers: {
        //to tell that we are authenticated and store the token inside auth header
        authorization: "Bearer " + token,
        //to accept only multipart form data
        //whenever we want to upload files from inside our front end to inside our backend,
        //we need to first specifically set the header to multipart form data.
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/movie/${id}`, {
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

export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/search?title=${title}`, {
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

// fetch 'type' wise top rated movies
export const getTopRatedMovies = async (type, signal) => {
  // we have to modify the request endpoint, depending upon, that is there type of movie?
  // i/e do we have to fetch the top rated movies of a particular type
  let endPoint = "/movie/top-rated";

  // if there is any type present send it through the endPoint
  if (type) {
    endPoint = endPoint + "?type=" + type;
  }
  try {
    const { data } = await client(endPoint, { signal });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

// fetch latest uploaded movies
export const getLatestUploads = async (signal) => {
  try {
    const { data } = await client("/movie/latest-uploads", { signal });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//get single movie
export const getSingleMovie = async (id) => {
  try {
    const { data } = await client("/movie/single/" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//get relates movies
export const getRelatedMovies = async (id) => {
  try {
    const { data } = await client("/movie/related/" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

// search all movies for user, by input field of title
export const searchPublicMovies = async (title) => {
  try {
    const { data } = await client("/movie/search-public?title=" + title);
    return data;
  } catch (error) {
    return catchError(error);
  }
};