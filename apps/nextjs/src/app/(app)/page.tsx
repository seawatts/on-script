import { Suspense } from "react";

// import { fetchQuery } from "convex/nextjs";

// import { api } from "@on-script/backend/convex/_generated/api";
import { db } from "@on-script/db/client";
import { H1 } from "@on-script/ui/typography";

import { ReadingList, ReadingListLoading } from "~/components/readings-list";
import { ScriptsList, ScriptsListLoading } from "./_components/scripts-list";

// export const runtime = "edge";

export default function Page() {
  const readings = db.query.Reading.findMany({
    orderBy: (reading, { desc }) => desc(reading.createdAt),
    where: (reading, { isNull }) => isNull(reading.endedAt),
    with: {
      characterAssignments: {
        with: {
          user: true,
        },
      },
      createdBy: true,
      currentElement: true,
      readingSessions: true,
      script: true,
    },
  }).execute();

  const scripts = db.query.Script.findMany({
    with: {
      characters: true,
      elements: true,
      readings: true,
    },
  });

  // const scripts2 = useQuery(api.scripts.get);
  // await fetchQuery(api.scripts.get);

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <H1>
          <span className="text-primary">On</span>Script
        </H1>
        {/* <NewReadingButton scriptId={props.params.scriptId} /> */}
        <div className="flex w-full max-w-2xl flex-col gap-4 overflow-y-scroll">
          <Suspense fallback={<ReadingListLoading />}>
            <ReadingList readings={readings} />
          </Suspense>
          <Suspense fallback={<ScriptsListLoading />}>
            <ScriptsList scripts={scripts} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
