export const validateMovie = (movieInfo) => {
  // mandatory things are to checked
  const {
    title,
    storyLine,
    language,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
  } = movieInfo;

  // TITLE
  if (!title.trim()) return { error: "Title is missing!" };
  //storyLine
  if (!storyLine.trim()) return { error: "Story line is missing!" };
  //language
  if (!language.trim()) return { error: "Language line is missing!" };
  //releaseDate
  if (!releaseDate.trim()) return { error: "Release data is missing!" };
  //status
  if (!status.trim()) return { error: "Status is missing!" };
  //type
  if (!type.trim()) return { error: "Type is missing!" };
  // genres
  //genres(if not array)
  if (!genres.length) return { error: "Genres are missing!" };
  //type of genre is not string
  for (let gen of genres) {
    if (!gen.trim()) return { error: "Invalid genres!" };
  }
  //tags
  //tags(if not array)
  if (!tags.length) return { error: "Tags are missing!" };
  //type of tag is not string
  for (let tag of tags) {
    if (!tag.trim()) return { error: "Invalid tags!" };
  }

  //cast
  //casts(if not array)
  if (!cast.length) return { error: "Cast and Crew's are missing!" };
  //type of cast is not object (properties of cast as name, role as, lead actor!)
  for (let c of cast) {
    if (typeof c !== "object") return { error: "Invalid cast!" };
  }

  // if everything is ok, return null
  return { error: null };
};
