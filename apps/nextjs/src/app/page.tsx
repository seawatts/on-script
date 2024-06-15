import { Button } from "@acme/ui/button";
import { Form } from "@acme/ui/form";
import { Icons } from "@acme/ui/icons";
import { Input } from "@acme/ui/input";
import { H1 } from "@acme/ui/typography";

import { JoinReading } from "../components/join-reading";
import { NewScript } from "../components/new-script";
import { ScriptSearch } from "../components/script-search";

// export const runtime = "edge";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  // const posts = api.post.all();

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <H1>
          <span className="text-primary">On</span>Script
          {/* <span className="text-primary">On</span>Script<span className="text-primary">AI</span> */}
        </H1>
        <ScriptSearch />
        <JoinReading />
        <NewScript />
      </div>
    </main>
  );
}
