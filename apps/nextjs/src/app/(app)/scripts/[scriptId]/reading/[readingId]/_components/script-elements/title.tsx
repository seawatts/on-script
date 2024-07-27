"use client";

import type { TextTypographyProps } from "@on-script/ui/typography";
import { Text } from "@on-script/ui/typography";

import { useReadingStore } from "~/providers/reading-store-provider";

export function Title() {
  const reading = useReadingStore((state) => state.reading);
  const textProps = {
    size: "script",
    spacing: "script",
    textFlow: "pretty",
    variant: "script-mono",
  } satisfies TextTypographyProps;

  return (
    <div className="relative flex flex-col items-center justify-center gap-24">
      <Text className="uppercase underline underline-offset-4">
        {reading?.script.title}
      </Text>
      <div className="flex flex-col items-center justify-center gap-4">
        <Text {...textProps}>Written By</Text>
        <Text {...textProps}>{reading?.script.writtenBy}</Text>
      </div>
      <div className="flex max-w-lg flex-col items-center justify-center gap-8">
        <Text {...textProps}>Based on the novel:</Text>
        <Text {...textProps} className="text-center">
          {reading?.script.basedOn}
        </Text>
        <Text
          {...textProps}
          className="flex flex-col items-center justify-center"
        >
          <div className="text-center">By</div>
          <div className="text-center">{reading?.script.basedOnBy}</div>
        </Text>
      </div>
    </div>
  );
}
