export default {
  "**/*.{ts,tsx}": [
    "pnpm format --write",
    "pnpm lint --fix",
    "pnpm tsc-files --noEmit --emitDeclarationOnly false",
  ],
  // "**/*.{ts,tsx}": [`pnpm tsc-files --noEmit`],
};
