// for slideShow transition we are using translate property!

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";
import { Link } from "react-router-dom";

let count = 0;
let intervalId;

let newTime = 0;
let lastTime = 0;
export default function HeroSlideshow() {
  // content on slide

  const [currentSlide, setCurrentSlide] = useState({});
  // clone slide, to handle animation

  const [clonedSlide, setClonedSlide] = useState({});
  const [visible, setVisible] = useState(true);
  // store latest movies we get from backend as a single slide

  const [slides, setSlides] = useState([]);

  //up next movies
  const [upNext, setUpNext] = useState([]);
  const slideRef = useRef();
  const clonedSlideRef = useRef();

  const { updateNotification } = useNotification();

  const fetchLatestUploads = async (signal) => {
    // send request to backend to fetch latest movies!!
    // only first 5 movies will be fetched!!
    const { error, movies } = await getLatestUploads(signal);
    //if error!
    if (error) return updateNotification("error", error);
    // set slides!!
    setSlides([...movies]);
    // set slide now, it will be first element of the movies array i.e we will display first movie
    setCurrentSlide(movies[0]);
  };

  const startSlideShow = () => {
    intervalId = setInterval(() => {
      newTime = Date.now();
      const delta = newTime - lastTime;
      // difference between slide show, if it is less than 4000 i.e something is wrong
      // so clear the interval
      if (delta < 4000) return clearInterval(intervalId);
      // call the neat click event after every interval for slide show
      handleOnNextClick();
    }, 3500);
  };

  const pauseSlideShow = () => {
    clearInterval(intervalId);
  };

  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;
    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;

    let newSlides = [...slides];

    newSlides = newSlides.slice(upNextCount, end);

    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }

    setUpNext([...newSlides]);
  };

  //0,1,2,3,4
  const handleOnNextClick = () => {
    lastTime = Date.now();
    // pause when we clicked
    pauseSlideShow();
    // to get current slide to clone it for the animation purpose

    setClonedSlide(slides[count]);
    // increase count index  by 1

    count = (count + 1) % slides.length;
    // set slide to movie at index count from 'slides' array of movies

    setCurrentSlide(slides[count]);
    // add class of animation for current poster animation to img tag by using useRef hook

    clonedSlideRef.current.classList.add("slide-out-to-left");
    // add class of animation for next poster animation to img tag by using useRef hook

    slideRef.current.classList.add("slide-in-from-right");

    //update UpNext array
    updateUpNext(count);
  };

  const handleOnPrevClick = () => {
    // pause when we clicked
    pauseSlideShow();
    // to get current slide to clone it for the animation purpose

    setClonedSlide(slides[count]);
    // set the count index

    count = (count + slides.length - 1) % slides.length;
    // set slide to movie at index count from 'slides' array of movies

    setCurrentSlide(slides[count]);
    // add class of animation for current poster animation to img tag by using useRef hook

    clonedSlideRef.current.classList.add("slide-out-to-right");
    // add class of animation for next poster animation to img tag by using useRef hook

    slideRef.current.classList.add("slide-in-from-left");

    //update UpNext array
    updateUpNext(count);
  };

  const handleAnimationEnd = () => {
    const classes = [
      "slide-out-to-left",
      "slide-in-from-right",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    // when animation ends, remove that animation class from img classes to render next animation!

    slideRef.current.classList.remove(...classes);
    clonedSlideRef.current.classList.remove(...classes);

    // set slide to empty
    setClonedSlide({});

    //start slide show, at end because we are pausing
    startSlideShow();
  };

  const handleOnVisibilityChange = () => {
    const visibility = document.visibilityState;
    // console.log(visibility);
    if (visibility === "hidden") setVisible(false);
    if (visibility === "visible") setVisible(true);
  };

  // whenever we visit home page we want to fetch latest uploads immediately so we need useEffect hook
  useEffect(() => {
    const ac = new AbortController();
    fetchLatestUploads(ac.signal);
    // to stop auto slider when we switched to another tab

    document.addEventListener("visibilitychange", handleOnVisibilityChange);

    // while unmounting!!, pause the slider!!!

    return () => {
      pauseSlideShow();
      // remove tab change wala functionality

      document.removeEventListener(
        "visibilitychange",
        handleOnVisibilityChange
      );
      ac.abort();
    };
  }, []);

  // boom the auto slide

  useEffect(() => {
    if (slides.length && visible) {
      startSlideShow();
      //update UpNext array
      updateUpNext(count);
    } else pauseSlideShow();
  }, [slides.length, visible]);

  return (
    <div className="w-full flex">
      {/* Slide SHOW section */}
      <div className="md:w-4/5 w-full aspect-video relative overflow-hidden">
        {/* use useRef hook to add transition effect, by adding animation class to image when we click on buttons  */}
        {/* current slide! */}
        <Slide
          ref={slideRef}
          title={currentSlide.title}
          src={currentSlide.poster}
          id={currentSlide.id}
        />
        {/* clone of current poster/movie for animation*/}
        <Slide
          ref={clonedSlideRef}
          onAnimationEnd={handleAnimationEnd}
          title={clonedSlide.title}
          className="absolute inset-0"
          src={clonedSlide.poster}
          id={currentSlide.id}
        />
        {/* buttons (controller) */}
        <SlideShowController
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>

      {/* Up Next Section */}
      <div className="w-1/5 md:block hidden space-y-3 px-3">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">
          Up Next
        </h1>
        {upNext.map(({ poster, id }) => {
          return (
            <img
              key={id}
              src={poster}
              alt=""
              className="aspect-video object-cover rounded"
            />
          );
        })}
      </div>
    </div>
  );
}

const SlideShowController = ({ onNextClick, onPrevClick }) => {
  const btnClass =
    "bg-primary rounded border-2 text-white text-xl p-2 outline-none";
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button onClick={onPrevClick} className={btnClass} type="button">
        <AiOutlineDoubleLeft />
      </button>
      <button onClick={onNextClick} className={btnClass} type="button">
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};

const Slide = forwardRef((props, ref) => {
  // rest is for other properties
  const { title, id, src, className = "", ...rest } = props;
  return (
    <Link
      to={"/movie/" + id}
      ref={ref}
      className={"w-full cursor-pointer block " + className}
      {...rest}
    >
      {src ? (
        <img className="aspect-video object-cover" src={src} alt="" />
      ) : null}
      {/* title */}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:from-primary dark:via-transparent">
          <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  );
});
