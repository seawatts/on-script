"use client";

import { useServerAction } from "zsa-react";

import { Button } from "@on-script/ui/button";
import { Icons } from "@on-script/ui/icons";

import { createNewReading } from "./actions";

export function NewReadingButton(props: { scriptId?: string }) {
  const { isPending, execute } = useServerAction(createNewReading);

  return (
    <Button
      onClick={() => props.scriptId && execute({ scriptId: props.scriptId })}
      disabled={isPending}
      className="flex gap-2"
    >
      {isPending && <Icons.Spinner />} <span>New Reading</span>
    </Button>
  );
}
