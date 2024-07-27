import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@on-script/ui/button";
import { Icons } from "@on-script/ui/icons";
import { H3, P, Text } from "@on-script/ui/typography";

import { fetchMovie, fetchMovieCredits, posterURL } from "~/utils/tmdb";

export default async function Page(props: {
  params: { type: "movie" | "tv"; id: string };
}) {
  if (!props.params.id) {
    return notFound();
  }

  if (!props.params.type) {
    return notFound();
  }
  // if (props.params.type === "movie") {
  const movie = await fetchMovie({ id: Number(props.params.id) });
  const movieCredits = await fetchMovieCredits({ id: Number(props.params.id) });
  // }

  if (!movie) {
    return notFound();
  }
  // if (props.params.type === "tv") {
  // const tvShow = await fetchTvShow({ id: Number(props.params.id) });
  // }

  return (
    <div className="relative flex flex-col">
      <div className="absolute z-20 p-4">
        <div>
          <Button asChild variant={"link"}>
            <Link href="/search">Back</Link>
          </Button>
        </div>
      </div>
      <div className="relative flex flex-col items-center md:flex-row">
        <div className="z-10 p-16 md:p-24">
          <Image
            src={posterURL({
              height: 900,
              posterPath: movie.poster_path,
              width: 600,
            })}
            loading="lazy"
            alt={movie.title}
            width={600}
            height={900}
            className="aspect-[6/9] h-auto w-full max-w-[600px] rounded-xl object-cover shadow-xl"
          />
        </div>
        <div className="absolute inset-0 w-full md:left-1/4 md:w-3/4">
          <Image
            alt={movie.title}
            src={posterURL({
              height: 720,
              posterPath: movie.backdrop_path,
              width: 1280,
            })}
            layout="fill"
            objectFit="cover"
            className="hidden object-cover brightness-50 md:block"
            style={{
              // WebkitMaskImage:
              // "linear-gradient(to right, transparent 33%, black 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 100%)",
            }}
          />
          <Image
            alt={movie.title}
            src={posterURL({
              height: 720,
              posterPath: movie.backdrop_path,
              width: 1280,
            })}
            layout="fill"
            objectFit="cover"
            className="block object-cover brightness-50 md:hidden"
            style={{
              // WebkitMaskImage:
              // "linear-gradient(to right, transparent 33%, black 100%)",
              maskImage: "linear-gradient(to top, transparent 0%, black 100%)",
            }}
          />
        </div>
        <div className="container z-10 flex flex-col gap-4 p-4 md:p-0">
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <H3>{movie.title}</H3>
            <H3 variant={"muted"} className="font-normal">
              ({new Date(movie.release_date).getFullYear()})
            </H3>
          </div>
          <div>
            <Text>Overview</Text>
            <P variant={"muted"} size="sm" className="w-full md:w-2/3">
              {movie.overview}
            </P>
          </div>
          <div>
            <Button asChild>
              <Link
                href={`/scripts/${props.params.id.toString()}/reading/character-selection`}
              >
                New Reading
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2">
        {movieCredits?.cast
          .sort((a, b) => a.order - b.order)
          .map((credit) => {
            let gender = "❓";

            switch (credit.gender) {
              case 1: {
                gender = "👩";
                break;
              }
              case 2: {
                gender = "👨";
                break;
              }
              case 3: {
                gender = "🧑";
                break;
              }
            }

            return (
              <div key={credit.id} className="flex items-center gap-2">
                {/* <Link href={`/scripts/${credit.id}/reading/character-selection`}> */}
                <Button variant={"primary"} size="icon">
                  <Icons.Plus />
                </Button>
                <Text>{gender}</Text>
                <Text>{credit.character}</Text>
                <Text variant={"muted"}>({credit.name})</Text>
                {/* </Link> */}
              </div>
            );
          })}
      </div>
    </div>
  );
}
