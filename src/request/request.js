export const baseUrl = 'https://api.themoviedb.org/3/'
export const API_KEY = 'api_key=f2edd756926fc9d78862d49600845a8d'

export const request = [
  {
    getNewUrl: `${baseUrl}discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&certification_country=GB&certification.gte=U&include_adult=true&include_video=true&page=1&`
  },
  {
    getMostPopularUrl: `${baseUrl}discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true`
  }
]

export const getReleaseData = {
  baseUrl,
  path: { part1: 'movie/', part2: 'replace with id', part3: 'release_dates' },
  API_KEY
}
