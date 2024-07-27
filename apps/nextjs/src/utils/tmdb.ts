import { isNil, omitBy } from "lodash-es";

import { env } from "~/env";

export interface ListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

async function query<T>(props: {
  path: string;
  params?: Record<string, string | number | boolean | undefined>;
}): Promise<T> {
  const queryParams = new URLSearchParams({
    api_key: env.TMDB_API_KEY,
    // include_adult: "false",
    // language: "en-US",
    // page: "1",
    ...omitBy(props.params ?? {}, isNil),
  });

  const url = new URL(
    `https://api.themoviedb.org/3${props.path}?${queryParams.toString()}`,
  );

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json() as T;
}

export function posterURL(props: {
  posterPath: string;
  width: number;
  height: number;
}) {
  return `https://image.tmdb.org/t/p/w${props.width}_and_h${props.height}_bestv2${props.posterPath}`;
}

export type SearchMultiResponse = ListResponse<{
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  title?: string;
  name?: string;
  media_type: "movie" | "tv" | "person";
  video: boolean;
  vote_average: number;
  vote_count: number;
}>;

export function queryMulti(props: {
  query: string;
  page?: number;
  includeAdult?: boolean;
  language?: string;
  primaryReleaseYear?: number;
  region?: string;
  year?: string;
}) {
  return query<SearchMultiResponse>({
    params: {
      include_adult: props.includeAdult,
      language: props.language,
      page: props.page,
      primary_release_year: props.primaryReleaseYear,
      query: props.query,
      region: props.region,
      year: props.year,
    },
    path: "/search/multi",
  });
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null | string;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: null | string;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export function fetchMovie(props: { id: number }) {
  return query<Movie | undefined>({
    path: `/movie/${props.id}`,
  });
}
export interface MovieCredits {
  id: number;
  cast: {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
  }[];
}

export function fetchMovieCredits(props: { id: number }) {
  return query<MovieCredits | undefined>({
    path: `/movie/${props.id}/credits`,
  });
}

export function fetchTopRated() {
  return query<SearchMultiResponse>({
    path: "/movie/top_rated",
  });
}
