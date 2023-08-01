import React from "react";
import GridContainer from "../GridContainer";
import { Link } from "react-router-dom";
import RatingStar from "../RatingStar";
import { getPoster } from "../../utils/helper";

const trimTitle = (text = "") => {
  // if length is less that 20 then its ok
  if (text.length <= 20) {
    return text;
  }

  // if not then send substring of length 20
  return text.substring(0, 20) + "..";
};

export default function MovieList({ title, movies = [] }) {
  // if there are no movies!
  // if (!movies.length) return null;

  return (
    <div>
      {/* TITLE of choice, render if passed to 'MovieList'  */}
      {title ? (
        <h1 className="text-2xl dark:text-white text-secondary font-semibold mb-5">
          {title}
        </h1>
      ) : null}
      {/*display each movie in grid fashion */}
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem movie={movie} key={movie.id} />;
        })}
      </GridContainer>
    </div>
  );
}

const ListItem = ({ movie }) => {
  // destructure properties we want to display from movie
  const { id, title, responsivePosters, poster, reviews } = movie;
  return (
    // we are giving tag as a link, because we want to open this particular movie when user click on this movie, the one which is displaying
    // 'to' will navigate us to single movie page!
    <Link to={"/movie/" + id}>
      {/* render POSTER */}
      <img
        className="aspect-video object-cover w-full"
        src={getPoster(responsivePosters) || poster}
        alt={title}
      />
      {/* TITLE */}
      <h1
        className="text-lg dark:text-white text-secondary font-semibold"
        title={movie.title}
      >
        {trimTitle(title)}
      </h1>

      {/* STAR and REVIEW*/}
      <RatingStar rating={reviews.ratingAvg} />
    </Link>
  );
};
