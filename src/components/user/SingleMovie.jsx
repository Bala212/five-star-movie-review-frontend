import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleMovie } from "../../api/movie";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";
import AddRatingModal from "../modals/AddRatingModal";
import CustomButtonLink from "../CustomButtonLink";
import ProfileModal from "../modals/ProfileModal";
import { convertReviewCount } from "../../utils/helper";



const convertDate = (date = "") => {
  return date.split("T")[0];
};

export default function SingleMovie() {
  //store a single movie
  const [movie, setMovie] = useState({});

  // to display the clicked actor profile as a cast ans crew
  const [selectedProfile, setSelectedProfile] = useState({});

  // is movie ready to render?
  const [ready, setReady] = useState(false);

  const [showRatingModal, setShowRatingModal] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);

  // get movie id from url
  const { movieId } = useParams();

  const { updateNotification } = useNotification();

  const { authInfo } = useAuth();

  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);

    //if any error
    if (error) return updateNotification("error", error);

    //if we fetch movie successfully the set ready to true
    setReady(true);

    // if no error, then set the movie
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate("/auth/signin");
    // if user is logged in then show rating modal
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    // update the review count and average rating of movie on adding a new review
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const hideProfileModal = () => {
    setShowProfileModal(false);
  };

  //fetch movie when we visit this page, whenever movieId changes i.e movie changes
  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  //if movie is not fetched yet then render that one
  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">
          Please wait
        </p>
      </div>
    );

  const {
    trailer,
    poster,
    storyLine,
    releaseDate,
    director = {},
    title,
    reviews = {},
    writers = [],
    cast = [],
    genres = [],
    language,
    type,
  } = movie;

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="xl:px-0 px-2">
        {/* trailer */}
        <video width="100%" poster={poster} controls src={trailer}></video>

        {/* title and review stuff */}
        <div className="flex justify-between">
          <h1 className="xl:text-4xl lg:text-3xl text-2xl  text-highlight dark:text-highlight-dark font-semibold py-3">
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <CustomButtonLink
              label={convertReviewCount(reviews.reviewCount) + "Reviews"}
              onClick={() => navigate("/movie/reviews/" + movieId)}
            />
            <CustomButtonLink
              label="Rate the Movie"
              onClick={handleOnRateMovie}
            />
          </div>
        </div>

        {/* storyLine, director, writer, etc */}
        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>
          {/* director */}
          <ListWithLabel label="Director:">
            <CustomButtonLink
              label={director.name}
              onClick={() => handleProfileClick(director)}
            />
          </ListWithLabel>
          {/* writers */}
          <ListWithLabel label="Writers:">
            {writers.map((w) => (
              <CustomButtonLink key={w.id} label={w.name} />
            ))}
          </ListWithLabel>
          {/* Casts */}
          <ListWithLabel label="Cast:">
            {cast.map(({ id, profile, leadActor }) => {
              //render if leadActor
              return leadActor ? (
                <CustomButtonLink label={profile.name} key={id} />
              ) : null;
            })}
          </ListWithLabel>
          {/* language */}
          <ListWithLabel label="Language:">
            <CustomButtonLink label={language} clickable={false} />
          </ListWithLabel>

          {/* release date */}
          <ListWithLabel label="Release Date:">
            <CustomButtonLink
              label={convertDate(releaseDate)}
              clickable={false}
            />
          </ListWithLabel>
          {/* genres */}
          <ListWithLabel label="Genres:">
            {genres.map((g) => (
              <CustomButtonLink label={g} key={g} clickable={false} />
            ))}
          </ListWithLabel>
          {/* type */}
          <ListWithLabel label="Type:">
            <CustomButtonLink label={type} clickable={false} />
          </ListWithLabel>
          {/* cast and role */}
          <CastProfiles cast={cast} />
          {/* Related Movies  */}
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>

      {/* Profile modal */}
      <ProfileModal
        visible={showProfileModal}
        onClose={hideProfileModal}
        profileId={selectedProfile.id}
      />

      {/* ADD RATING MODAL */}
      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
}

const ListWithLabel = ({ label, children }) => {
  return (
    <div className="flex space-x-2">
      <p className="text-light-subtle dark:text-dark-subtle font-semibold">
        {label}
      </p>
      {children}
    </div>
  );
};

const CastProfiles = ({ cast }) => {
  return (
    <div className="mt-5">
      <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
        Cast:
      </h1>
      <div className="flex flex-wrap space-x-4">
        {cast.map(({ id, profile, roleAs }) => {
          return (
            <div
              key={id}
              className="basis-28 flex flex-col items-center text-center mb-4"
            >
              <img
                className="w-24 h-24 aspect-square object-cover rounded-full"
                src={profile.avatar}
                alt=""
              />
              {/* name */}
              <CustomButtonLink label={profile.name} />
              <span className="text-light-subtle dark:text-dark-subtle text-sm">
                as
              </span>
              {/* role as */}
              <p className="text-light-subtle dark:text-dark-subtle">
                {roleAs}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
