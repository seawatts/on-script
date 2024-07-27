import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@on-script/ui/button";
import { H3, P, Text } from "@on-script/ui/typography";

import { posterURL } from "~/utils/tmdb";
import { fetchScript } from "./actions";

export default async function Page(props: { params: { scriptId: string } }) {
  // const readings = db.query.Reading.findMany({
  //   orderBy: (reading, { asc }) => asc(reading.createdAt),
  //   where: (reading, { isNull }) => isNull(reading.endedAt),
  //   with: {
  //     characterAssignments: {
  //       with: {
  //         user: true,
  //       },
  //     },
  //     createdBy: true,
  //     readingSessions: true,
  //     script: true,
  //   },
  // }).execute();
  if (!props.params.scriptId) {
    return notFound();
  }

  const [movie] = await fetchScript({ id: Number(props.params.scriptId) });

  if (!movie) {
    return notFound();
  }

  return (
    <div className="container relative flex items-center">
      <div className="z-10 p-24">
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
          className="aspect-[6/9] h-auto w-[600px] rounded-xl object-cover shadow-xl"
        />
      </div>
      <div className="absolute inset-0 left-1/4 w-3/4">
        <Image
          alt={movie.title}
          src={posterURL({
            height: 720,
            posterPath: movie.backdrop_path,
            width: 1280,
          })}
          layout="fill"
          objectFit="cover"
          className="object-cover brightness-95"
          style={{
            // WebkitMaskImage:
            // "linear-gradient(to right, transparent 33%, black 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 100%)",
          }}
        />
      </div>
      <div className="z-10 flex flex-col gap-4">
        <div className="flex gap-2">
          <H3>{movie.title}</H3>
          <H3 variant={"muted"} className="font-normal">
            ({new Date(movie.release_date).getFullYear()})
          </H3>
        </div>
        <div>
          <Text>Overview</Text>
          <P variant={"muted"} size="sm" className="w-2/3">
            {movie.overview}
          </P>
        </div>
        <div>
          <Button asChild>
            <Link
              href={`/scripts/${props.params.scriptId.toString()}/reading/character-selection`}
            >
              New Reading
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
