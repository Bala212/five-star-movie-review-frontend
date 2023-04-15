import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNotification } from "../../hooks";
import { uploadMovie, uploadTrailer } from "../../api/movie";
import MovieForm from "./MovieForm";
import ModalContainer from "../modals/ModalContainer";

export default function MovieUpload({ visible, onClose }) {
  const { updateNotification } = useNotification();
  const [videoSelected, setVideoSelected] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [trailerInfo, setTrailerInfo] = useState({});
  const [busy, setBusy] = useState(false);

  const resetState = () => {
    setVideoSelected(false);
    setTrailerInfo({});
    setVideoUploaded(false);
    setUploadProgress(0);
  };

  const handleUploadTrailer = async (data) => {
    //fetch the url and id of the trailer from the backend
    const { error, url, public_id } = await uploadTrailer(
      data,
      setUploadProgress
    ); //setting progress by callback function in uploadTrailer method
    //if no error then video is uploaded to cloudinary
    if (error) return updateNotification("error", error);

    //otherwise
    setVideoUploaded(true);

    //set the trailer's url and id
    setTrailerInfo({ url, public_id });
  };

  //   console.log(trailerInfo);

  const handleChange = (file) => {
    //we have pass multipart/form-data so to create it
    const formData = new FormData(); //a js api to create form-data
    //append the form data of trailer with property trailer
    //same as while uploading to cloud in backend i.e 'uploadVideo.single("trailer")'
    formData.append("trailer", file);
    //if we successfully selected the trailer!!
    setVideoSelected(true);
    handleUploadTrailer(formData);
  };

  const handleTypeError = (error) => {
    updateNotification("error", error);
  };

  const getUploadProgressValue = () => {
    //video uploaded at backend but not to cloudinary
    if (!videoUploaded && uploadProgress >= 100) {
      return "Processing";
    }

    return `Upload progress ${uploadProgress}%`;
  };

  // this 'data' is coming from 'MovieForm'
  const handleSubmit = async (data) => {
    // check for trailer separately!!
    // if no url or public_id
    if (!trailerInfo.url || !trailerInfo.public_id) {
      return updateNotification("error", "Trailer is missing!");
    }
    // busy indicator on upload button!
    setBusy(true);
    // if is url and public_id then append stringified version of trailerInfo (for sending to backend) it to data
    data.append("trailer", JSON.stringify(trailerInfo));

    // send data to backend to upload a movie!!
    const { error, movie } = await uploadMovie(data);

    // after uploading remove busy indicator, set busy to false
    setBusy(false);

    //if any error
    if (error) return updateNotification("error", error);

    // if gets created !!
    updateNotification("success", "Movie uploaded successfully.");

    //reset all the states
    resetState();

    // close the form, after uploading the movie!!
    onClose();
  };

  return (
    <ModalContainer visible={visible}>
      <div className="mb-5">
        <UploadProgress
          //render if and only if video is not uploaded to cloud and same video is selected to store inside cloud by drag and drop
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
          width={uploadProgress}
        />
      </div>
      {/* if video is selected, then show movie form. Otherwise show TrailerSelector */}
      {!videoSelected ? (
        <TrailerSelector
          visible={!videoSelected}
          onTypeError={handleTypeError}
          handleChange={handleChange}
        />
      ) : (
        <MovieForm
          buttonTitle="Upload"
          busy={busy}
          onSubmit={!busy ? handleSubmit : null}
        />
      )}
    </ModalContainer>
  );
}

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;
  return (
    <div className="h-full flex items-center justify-center">
      {/* type id just to accept video files!! Wow thing is that when we click to upload a file
          it will only show files of type mentioned in 'types', and onTypeError is to handle drag
          and drop the file which is not mentioned in 'types'*/}
      <FileUploader
        handleChange={handleChange}
        onTypeError={onTypeError}
        types={["mp4", "avi"]}
      >
        {/* this is a children to change the default ui of drag and drop */}
        <label
          className="w-48 h-48 border border-dashed dark:border-dark-subtle
             border-light-subtle rounded-full flex flex-col items-center justify-center
              dark:text-dark-subtle text-secondary cursor-pointer"
        >
          <AiOutlineCloudUpload size={80} />
          <p>Drop our file here!</p>
        </label>
      </FileUploader>
    </div>
  );
};

const UploadProgress = ({ width, message, visible }) => {
  //once file is uploaded don't show the progress
  if (!visible) return null;
  return (
    <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
      <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
        {/* this div is inside above div so make it relative and absolute
          and we are styling width explicitly because we want to change the progress */}
        <div
          style={{ width: width + "%" }}
          className="h-full absolute left-0 dark:bg-white bg-secondary"
        />
      </div>
      <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1">
        {message}
      </p>
    </div>
  );
};
