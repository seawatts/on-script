import type { QueryTmdbReturnType } from "./_components/actions";
import { fetchTopRated } from "~/utils/tmdb";
import { queryTmdb } from "./_components/actions";
import { Search } from "./_components/search";

export default async function Page(props: { searchParams: { query: string } }) {
  let results: QueryTmdbReturnType = [];

  if (props.searchParams.query) {
    const [queryResults] = await queryTmdb({ query: props.searchParams.query });

    if (queryResults) {
      results = queryResults;
    }
  } else {
    const popularResults = await fetchTopRated();
    results = popularResults.results.map((result) => ({
      ...result,
      media_type: "movie",
    }));
  }

  return (
    <main className="container h-screen max-w-7xl py-16">
      <Search results={results} />
    </main>
  );
}
