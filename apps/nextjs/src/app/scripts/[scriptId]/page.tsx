"use client";

import type { TextTypographyProps } from "@acme/ui/typography";
import { Separator } from "@acme/ui/separator";
import { Text } from "@acme/ui/typography";

import type { Element, IScene } from "~/components/script-elements/types";
import { Header } from "~/components/header";
import { OmniBar } from "~/components/omni-bar";
import { Scene } from "~/components/script-elements/scene";
import { ScriptProvider } from "~/components/script-elements/script-context";
import {
  DialogDirection,
  ElementType,
} from "~/components/script-elements/types";

// import { useHideOnScroll } from "~/hooks/use-hide-on-scroll";

// import { api } from "~/trpc/server";

// export const runtime = "edge";
export default function ScriptIdPage() {
  // const { hidden } = useHideOnScroll({ scrollHeight: 100 });

  // You can await this here if you don't want to show Suspense fallback below
  // const posts = api.script.all();
  const textProps = {
    size: "script",
    spacing: "script",
    textFlow: "pretty",
    variant: "script-mono",
  } satisfies TextTypographyProps;

  // const dialogWidth = "w-10/12 lg:w-7/12";
  const elements = [
    {
      index: 0,
      text: "A VAST SPHERE OF FIRE, the fire of a thousand suns, slowly eats the night-time desert. A line of black type appears:",
      type: ElementType.ACTION,
    },

    // {
    //   exterior: false,
    //   interior: true,
    //   location: "",
    //   specificLocation: "",
    //   time: "",
    //   type: ElementType.SUB_HEADING,
    // },
    {
      character: "Voice",
      continued: true,
      direction: DialogDirection.OFF_SCREEN,
      index: 1,
      text: "Dr Oppenheimer, as we begin, I believe you have a statement to read into the record?",
      type: ElementType.DIALOGUE,
    },
    {
      character: "Oppenheimer",
      index: 2,
      text: "Yes, your honour-",
      type: ElementType.DIALOGUE,
    },
    {
      character: "Second Voice",
      direction: DialogDirection.OFF_SCREEN,
      index: 3,
      text: "We’re not judges, doctor.",
      type: ElementType.DIALOGUE,
    },
    {
      character: "Oppenheimer",
      index: 4,
      text: "No. Of course.",
      type: ElementType.DIALOGUE,
    },
    {
      character: "Oppenheimer",
      index: 5,
      text: "(I start reading)",
      type: ElementType.PARENTHETICAL,
    },
    {
      character: "Oppenheimer",
      index: 6,
      text: "Members of the Security Board, the so-called derogatory information in your indictment of me cannot be fairly understood except in the context of my life and work. This answer is a summary of relevant aspects of my life in more or less chronological order...",
      type: ElementType.DIALOGUE,
    },
    {
      character: "Senate Aide",
      direction: DialogDirection.VOICE_OVER,
      index: 7,
      text: "How long did he testify?",
      type: ElementType.DIALOGUE,
    },
    {
      index: 8,
      text: "CUT TO:",
      type: ElementType.TRANSITION,
    },
  ] satisfies Element[];

  const scenes: IScene[] = [
    {
      elements,
      id: "1",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col py-4 sm:gap-4">
      {/* <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14"> */}
      {/* <Header /> */}
      <main className="container mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center">
        <ScriptProvider elements={scenes[0]?.elements ?? []}>
          <div className="relative flex flex-col items-center justify-center gap-24">
            {/* <div className="sticky top-0 z-30 flex h-14 w-full items-center justify-center border-b bg-background text-center underline"> */}
            <Text className="underline">Oppenheimer</Text>
            {/* </div> */}
            <div className="flex flex-col items-center justify-center gap-4">
              <Text {...textProps}>Written By</Text>
              <Text {...textProps}>Christopher Nolan</Text>
            </div>
            <div className="flex max-w-lg flex-col items-center justify-center gap-8">
              <Text {...textProps}>Based on the novel:</Text>
              <Text
                {...textProps}
                className="flex flex-col items-center justify-center text-pretty"
              >
                <div className="text-center">"American Prometheus:</div>
                <div className="text-center">
                  The Triumph and Tragedy of J. Robert Oppenheimer"
                </div>
              </Text>
              <Text
                {...textProps}
                className="flex flex-col items-center justify-center"
              >
                <div className="text-center">By</div>
                <div className="text-center">
                  Kai Bird and Martin J. Sherwin
                </div>
              </Text>
            </div>

            <Separator />
            {scenes.map((scene) => (
              <div className="flex flex-col gap-24" key={scene.id}>
                <Scene scene={scene} />
                <Separator />
              </div>
            ))}
          </div>
          <OmniBar />
        </ScriptProvider>
      </main>
    </div>
  );
}
