import { redirect } from "next/navigation";

import { ReadingStoreProvider } from "~/providers/reading-store-provider";
import { getReading } from "./queries";

export default async function Layout(props: {
  children: React.ReactNode;
  params: { readingId: string };
}) {
  const { readingId } = props.params;

  const reading = await getReading(readingId);

  if (!reading) {
    redirect("/404");
  }

  return (
    <div>
      <ReadingStoreProvider reading={reading}>
        {props.children}
      </ReadingStoreProvider>
    </div>
  );
}
