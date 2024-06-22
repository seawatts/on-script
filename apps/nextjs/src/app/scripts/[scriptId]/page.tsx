import { Suspense } from "react";

import { db } from "@on-script/db/client";

import { NewReadingButton } from "~/components/new-reading-button";
import { ReadingList, ReadingListLoading } from "~/components/readings-list";

// export const runtime = "edge";

export default function ScriptIdPage(props: { params: { scriptId: string } }) {
  const readings = db.query.Reading.findMany({
    orderBy: (reading, { asc }) => asc(reading.createdAt),
    where: (reading, { isNull }) => isNull(reading.endedAt),
    with: {
      createdBy: true,
      readingSessions: true,
      script: true,
    },
  }).execute();

  return (
    <div className="flex min-h-screen flex-col py-4 sm:gap-4">
      <main className="container mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center">
        <NewReadingButton scriptId={props.params.scriptId} />
        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense fallback={<ReadingListLoading />}>
            <ReadingList readings={readings} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
