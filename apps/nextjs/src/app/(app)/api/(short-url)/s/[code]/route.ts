import { redirect } from "next/navigation";

import { db } from "@on-script/db/client";

export async function GET(
  request: Request,
  { params }: { params: { code: string } },
) {
  const reading = await db.query.Reading.findFirst({
    where: (shortUrls, { eq }) => eq(shortUrls.slug, params.code),
    with: {
      script: true,
    },
  });

  if (!reading) {
    return new Response("Not found", { status: 404 });
  }

  redirect(
    `/scripts/${reading.script.id}/reading/${reading.id}/character-selection`,
  );
}
