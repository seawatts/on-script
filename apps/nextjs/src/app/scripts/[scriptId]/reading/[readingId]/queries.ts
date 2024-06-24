import { cache } from "react";

import { eq } from "@on-script/db";
import { db } from "@on-script/db/client";
import { Reading } from "@on-script/db/schema";

export const getReading = cache((readingId: string) => {
  return db.query.Reading.findFirst({
    where: eq(Reading.id, readingId),
    with: {
      characterAssignments: true,
      createdBy: true,
      readingSessions: true,
      script: {
        with: {
          characters: true,
          elements: true,
        },
      },
    },
  });
});
