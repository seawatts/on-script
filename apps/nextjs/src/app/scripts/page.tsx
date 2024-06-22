import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";

import { db } from "@on-script/db/client";
import { H1 } from "@on-script/ui/typography";

import { ScriptsList, ScriptsListLoading } from "../_components/scripts-list";

export default function Page() {
  const scripts = db.query.Script.findMany({
    with: {
      characters: true,
      elements: true,
      readings: true,
    },
  });

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <H1>
          <span className="text-primary">On</span>Script
          <UserButton />
        </H1>

        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense fallback={<ScriptsListLoading />}>
            <ScriptsList scripts={scripts} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
