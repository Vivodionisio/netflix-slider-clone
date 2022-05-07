export const genreElements = genres => {
  return genres.map((genre, index) => {
    if (index < 1) {
      return (
        <span key={index} className="name">
          {genre.name}&nbsp;
        </span>
      )
    } else if (index < 3) {
      return (
        <span key={index} className="name">
          <span className="bullet">&#8226;</span>&nbsp;{genre.name}{' '}
        </span>
      )
    } else {
      return null
    }
  })
}
