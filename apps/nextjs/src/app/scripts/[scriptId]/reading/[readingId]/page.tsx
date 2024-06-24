import { redirect } from "next/navigation";

import { Separator } from "@on-script/ui/separator";

import { ReadingStoreProvider } from "~/providers/reading-store-provider";
import { OmniBar } from "./_components/omni-bar";
import { Presence } from "./_components/presence";
import { ElementsList } from "./_components/script-elements/list";
import { Title } from "./_components/script-elements/title";
import { getReading } from "./queries";

export default async function Page(props: {
  params: { scriptId: string; readingId: string };
}) {
  const { readingId } = props.params;
  const reading = await getReading(readingId);

  if (!reading) {
    redirect("/404");
  }

  return (
    <div className="flex min-h-screen flex-col py-4 sm:gap-4">
      <main className="container mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4">
        <ReadingStoreProvider reading={reading}>
          <Presence />
          <Title />
          <Separator />
          <ElementsList />
          <OmniBar />
        </ReadingStoreProvider>
      </main>
    </div>
  );
}
