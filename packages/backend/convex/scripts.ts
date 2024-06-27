import { query } from "./_generated/server.js";

export const get = query({
  args: {},
  handler: async (context) => {
    return context.db.query("scripts").collect();
  },
});
