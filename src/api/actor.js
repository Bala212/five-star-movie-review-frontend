import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createActor = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/actor/create", formData, {
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

export const searchActor = async (query) => {
  const token = getToken();
  try {
    // this arguments from url are fetched in backend using 'req.query'
    const { data } = await client(`/actor/search?name=${query}`, {
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

export const getActors = async (pageNo, limit) => {
  const token = getToken();
  try {
    // this arguments from url are fetched in backend using 'req.query'
    const { data } = await client(
      `/actor/actors?pageNo=${pageNo}&limit=${limit}`,
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

export const updateActor = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/actor/update/" + id, formData, {
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

export const deleteActor = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete("/actor/" + id, {
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

export const getActorProfile = async (id) => {
  try {
    const { data } = await client.get(`/actor/single/${id}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
