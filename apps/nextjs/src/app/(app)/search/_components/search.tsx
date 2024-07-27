"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash-es";
import { useServerAction } from "zsa-react";

import { Icons } from "@on-script/ui/icons";
import { Input } from "@on-script/ui/input";
import { H3, Text } from "@on-script/ui/typography";

import type { QueryTmdbReturnType } from "./actions";
import { posterURL } from "~/utils/tmdb";
import { queryTmdb } from "./actions";

export function Search(props: { results: QueryTmdbReturnType }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryTmdbAction = useServerAction(queryTmdb);

  const [results, setResults] = useState<QueryTmdbReturnType>(props.results);

  useEffect(() => {
    if (queryTmdbAction.data) {
      setResults(queryTmdbAction.data);
    }
  }, [queryTmdbAction.data]);

  const [query, setQuery] = useState(searchParams.get("query") ?? "");

  const debouncedApiCall = useCallback(
    debounce(async (value) => {
      if (!value) {
        setResults([]);
        router.push(`/search`); // Remove URL query parameter
        return;
      }

      const [response] = await queryTmdbAction.execute({ query: value });

      if (response) {
        setResults(response);
      }
      router.push(`/search?query=${value}`); // Update URL query parameter
    }, 500),
    [],
  );

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setQuery(value); // Update state immediately
    debouncedApiCall(value); // Debounce API call
  };

  const numberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    style: "decimal",
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex w-full items-center gap-4 lg:w-1/3">
        <Icons.Search className={"absolute left-2"} />
        <Input
          onChange={handleInputChange}
          value={query}
          className="pl-10"
          autoFocus
          placeholder="Search for movies or TV shows"
        />
        {queryTmdbAction.isPending && (
          <Icons.Spinner className={"absolute right-2"} />
        )}
        {!queryTmdbAction.isPending && query && (
          <Icons.X
            className={"absolute right-2 cursor-pointer"}
            onClick={() => {
              setQuery("");
              router.push(`/search`); // Remove URL query parameter
              setResults([]);
            }}
          />
        )}
      </div>
      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {results.map(
            ({
              id,
              poster_path,
              title,
              name,
              vote_average,
              release_date,
              first_air_date,
              media_type,
            }) => (
              <Link
                key={id}
                className="group relative flex basis-1/6 cursor-pointer flex-col"
                href={`/search/${media_type}/${id}`}
              >
                <Image
                  src={posterURL({
                    height: 900,
                    posterPath: poster_path,
                    width: 600,
                  })}
                  loading="lazy"
                  alt={title ?? name ?? "Media"}
                  width={600}
                  height={900}
                  className="aspect-[6/9] h-auto w-[600px] rounded-lg object-cover shadow-lg group-hover:opacity-50"
                />
                <div className="absolute inset-x-0 bottom-0 flex h-1/3 flex-col justify-end rounded-lg bg-gradient-to-t from-black/90 to-transparent p-2 shadow-lg">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Icons.Star className={"fill-white stroke-none"} />
                      <Text className="text-white">
                        {numberFormatter.format(vote_average)}
                      </Text>
                    </div>
                    {(release_date ?? first_air_date) && (
                      <Text className="text-white">
                        {/* {new Date(release_date ?? first_air_date).getFullYear()} */}
                      </Text>
                    )}
                  </div>
                </div>
                <div className="absolute top-1/2 hidden h-auto w-full items-center justify-center overflow-hidden px-2 text-center group-hover:flex">
                  <H3 className="text-white">{title ?? name}</H3>
                </div>
              </Link>
            ),
          )}
        </div>
      )}
      {results.length === 0 && query && !queryTmdbAction.isPending && (
        <Text>No results found</Text>
      )}
    </div>
  );
}
