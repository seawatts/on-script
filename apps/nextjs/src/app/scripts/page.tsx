import { Suspense } from "react";

import { H1 } from "@acme/ui/typography";

// export const runtime = "edge";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  // const posts = api.post.all();

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <H1>
          Script <span className="text-primary">AI</span>
        </H1>

        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={<div className="flex w-full flex-col gap-4"></div>}
          >
            {/* <PostList posts={posts} /> */}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
