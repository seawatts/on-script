"use server";

import type { inferServerActionReturnData } from "zsa";
import { z } from "zod";

import { authenticatedAction } from "~/safe-action";
import { queryMulti } from "~/utils/tmdb";

export const queryTmdb = authenticatedAction
  .createServerAction()
  .input(z.object({ query: z.string() }))
  .handler(async ({ input }) => {
    const { results } = await queryMulti({ query: input.query });

    return results
      .filter(({ poster_path }) => !!poster_path)
      .filter(({ media_type }) => media_type === "movie" || media_type === "tv")
      .filter(Boolean)
      .sort((a, b) => b.popularity - a.popularity);
  });

export type QueryTmdbReturnType = inferServerActionReturnData<typeof queryTmdb>;
