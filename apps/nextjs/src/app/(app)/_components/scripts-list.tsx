"use client";

import { camelCase, startCase } from "lodash-es";
import pluralize from "pluralize";

import type { ScriptQuerySchema } from "@on-script/db/schema";
import { Badge } from "@on-script/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@on-script/ui/card";
import { Text } from "@on-script/ui/typography";

import { NewReadingButton } from "~/components/new-reading-button";
import { useSubscribeToScripts } from "~/supabase/subscriptions";

export function ScriptsList(props: { scripts: Promise<ScriptQuerySchema[]> }) {
  const scripts = useSubscribeToScripts({ scripts: props.scripts });
  // const user = useUserStore((store) => store.user);

  // console.log(scripts);
  return (
    // <div className="flex flex-col gap-4">
    //   {/* {scripts.length} */}
    //   {/* {user?.fullName} */}
    //   {scripts.map((script) => (
    //     <Button asChild variant={"outline"} key={script.id}>
    //       <Link href={`/scripts/${script.id}`}>
    //         <div>{script.title}</div>
    //         <div>{script.readings.length}</div>
    //         {/* <div>{script.id}</div> */}
    //         {/* <div>{script.director}</div>
    //       <div>{script.writer}</div>
    //       <div>{script.summary}</div>
    //       <div>{script.lines}</div>
    //       <div>{script.characters}</div>
    //       <div>{script.readingTime}</div>
    //       <div>{script.themes}</div>
    //       <div>{script.onScriptRating}</div>
    //       <div>{script.loved}</div>
    //       <div>{script.liked}</div>
    //       <div>{script.disliked}</div>
    //       <div>{script.reads}</div>
    //       <div>{script.ratingSystem}</div>
    //       <div>{script.ratingValue}</div>
    //       <div>{script.ratingDescription}</div>
    //       <div>{script.imdbRating}</div>
    //       <div>{script.rottentTomatosRating}</div>
    //       <div>{script.releaseDate}</div> */}
    //         {/* <div>{script.createdAt}</div> */}
    //       </Link>
    //     </Button>
    //   ))}
    // </div>
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Scripts</CardTitle>
          <CardDescription>Start a new reading</CardDescription>
        </CardHeader>
        <CardContent>
          {scripts.length > 0 && (
            <ul className="flex flex-col gap-6">
              {scripts.map((script) => {
                return (
                  <li key={script.id} className="flex justify-between">
                    <div className="flex flex-col gap-2">
                      <Text size="xl">
                        {startCase(camelCase(script.title))}
                        {/* {reading.createdBy.firstName}{" "} */}
                        {/* {reading.createdBy.lastName} */}
                      </Text>
                      <div className="flex gap-2">
                        <Badge variant={"outline"}>
                          {script.readings.length}{" "}
                          {pluralize("reading", script.readings.length)}
                        </Badge>
                        <Badge variant={"outline"}>
                          {
                            script.elements.filter(
                              (element) => element.type === "dialog",
                            ).length
                          }{" "}
                          {pluralize(
                            "line",
                            script.elements.filter(
                              (element) => element.type === "dialog",
                            ).length,
                          )}
                        </Badge>
                        <Badge variant={"outline"}>
                          {script.characters.length - 1}{" "}
                          {pluralize("character", script.characters.length - 1)}
                        </Badge>
                        <Badge variant={"outline"}>
                          {script.readingTime}{" "}
                          {pluralize("minute", script.readingTime)}
                        </Badge>
                      </div>
                    </div>
                    <NewReadingButton scriptId={script.id} />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
        {/* <CardFooter></CardFooter> */}
      </Card>
    </div>
  );
}

export function ScriptsListLoading() {
  return <div>Loading...</div>;
}
