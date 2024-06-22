import { redirect } from "next/navigation";

import type { TextTypographyProps } from "@on-script/ui/typography";
import { eq } from "@on-script/db";
import { db } from "@on-script/db/client";
import { ElementType, Reading } from "@on-script/db/schema";
import { Separator } from "@on-script/ui/separator";
import { Text } from "@on-script/ui/typography";

import { Action } from "~/app/scripts/[scriptId]/reading/[readingId]/_components/script-elements/action";
import { ScriptProvider } from "~/app/scripts/[scriptId]/reading/[readingId]/_components/script-elements/script-context";
import { OmniBar } from "./_components/omni-bar";
import { Presence } from "./_components/presence";
import { Dialog } from "./_components/script-elements/dialog";

export default async function Page(props: {
  params: { scriptId: string; readingId: string };
}) {
  const { readingId } = props.params;

  const reading = await db.query.Reading.findFirst({
    where: eq(Reading.id, readingId),
    with: {
      characterAssignments: true,
      readingSessions: true,
      script: {
        with: {
          characters: true,
          elements: true,
        },
      },
    },
  });

  if (!reading) {
    redirect("/404");
  }

  const textProps = {
    size: "script",
    spacing: "script",
    textFlow: "pretty",
    variant: "script-mono",
  } satisfies TextTypographyProps;

  const elements = reading.script.elements;

  return (
    <div className="flex min-h-screen flex-col py-4 sm:gap-4">
      <Presence readingId={readingId} />
      <main className="container mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4">
        <ScriptProvider elements={elements}>
          <div className="relative flex flex-col items-center justify-center gap-24">
            <Text className="uppercase underline underline-offset-4">
              {reading.script.title}
            </Text>
            <div className="flex flex-col items-center justify-center gap-4">
              <Text {...textProps}>Written By</Text>
              <Text {...textProps}>{reading.script.writtenBy}</Text>
            </div>
            <div className="flex max-w-lg flex-col items-center justify-center gap-8">
              <Text {...textProps}>Based on the novel:</Text>
              <Text {...textProps} className="text-center">
                {reading.script.basedOn}
              </Text>
              <Text
                {...textProps}
                className="flex flex-col items-center justify-center"
              >
                <div className="text-center">By</div>
                <div className="text-center">{reading.script.basedOnBy}</div>
              </Text>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            {elements.map((element) => (
              <div className="flex flex-col" key={element.id}>
                {element.type === ElementType.action && (
                  <Action element={element} />
                )}
                {element.type === ElementType.dialog && (
                  <Dialog element={element} />
                )}
              </div>
            ))}
            {/* <Scene scene={scene} /> */}
            {/* <Separator /> */}
            {/* ))} */}
          </div>
          <OmniBar />
        </ScriptProvider>
      </main>
    </div>
  );
}
