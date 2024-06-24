"use client";

import { cn } from "@on-script/ui";
import { Button } from "@on-script/ui/button";
import { useHideOnScroll } from "@on-script/ui/hooks/use-hide-on-scroll";
import { Icons } from "@on-script/ui/icons";

import { useReadingStore } from "~/providers/reading-store-provider";
import { DropdownMenuDemo } from "./nav-menu";
import { Search } from "./search";

export function OmniBar() {
  const selectedElement = useReadingStore((store) => store.selectedElement);
  const setCurrentElementId = useReadingStore(
    (store) => store.setCurrentElementId,
  );
  const elements = useReadingStore((store) => store.reading?.script.elements);

  const { hidden } = useHideOnScroll({
    scrollHeight: 100,
    scrollUpHeight: 100,
  });

  return (
    <div
      className={cn(
        "fixed flex max-w-max transform items-center justify-between gap-3 divide-x divide-zinc-600 rounded-full bg-secondary p-2 transition-all",
        {
          "bottom-0 translate-y-full": hidden,
          "bottom-2 sm:bottom-4": !hidden,
        },
      )}
    >
      <div className="flex items-center gap-2 pr-2">
        <DropdownMenuDemo />
        <Search />
        <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
        >
          <div className="relative">
            {/* <img
              alt="Avatar 3"
              className="rounded-full bg-gray-700 opacity-50"
              height="32"
              src="/placeholder.svg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            /> */}
            <span className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-xs font-bold text-white">
              9+
            </span>
          </div>
          <span className="sr-only">Edit</span>
        </Button>
      </div>
      <div className="flex items-center gap-2 pl-2">
        {/* <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
        >
          <Icons.ChevronsLeft size="lg" className={"stroke-1"} />
          <span className="sr-only">Edit</span>
        </Button> */}

        <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
          onClick={() => {
            const currentIndex = selectedElement?.index ?? 0;
            if (currentIndex > 0 || !elements) {
              return;
            }

            const previousElement = elements[currentIndex - 1];
            if (!previousElement) {
              return;
            }

            setCurrentElementId(previousElement.id);
          }}
        >
          <Icons.ChevronLeft size="lg" className={"stroke-1"} />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
          // onClick={() => setCurrentElementId(undefined)}
        >
          <Icons.CircleDot size="lg" className={"stroke-1"} />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
          onClick={() => {
            const currentIndex = selectedElement?.index ?? 0;
            if (currentIndex < (elements?.length ?? 0) || !elements) {
              return;
            }

            const nextElement = elements[currentIndex + 1];
            if (!nextElement) {
              return;
            }

            setCurrentElementId(nextElement.id);
          }}
        >
          <Icons.ChevronRight size="lg" className={"stroke-1"} />
          <span className="sr-only">Edit</span>
        </Button>
        {selectedElement?.index ?? 0}
        {/* <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
        >
          <Icons.ChevronsRight size="lg" className={"stroke-1"} />
          <span className="sr-only">Edit</span>
        </Button> */}
        {/* <img
          alt="Avatar 1"
          className="rounded-full border-2 border-red-500 bg-gray-500"
          height="32"
          src="/placeholder.svg"
          style={{
            aspectRatio: "32/32",
            objectFit: "cover",
          }}
          width="32"
        />
        <img
          alt="Avatar 2"
          className="rounded-full border-2 border-green-500 bg-gray-500"
          height="32"
          src="/placeholder.svg"
          style={{
            aspectRatio: "32/32",
            objectFit: "cover",
          }}
          width="32"
        />
        <div className="relative">
          <img
            alt="Avatar 3"
            className="rounded-full border-2 border-[#666666] bg-gray-700 opacity-50"
            height="32"
            src="/placeholder.svg"
            style={{
              aspectRatio: "32/32",
              objectFit: "cover",
            }}
            width="32"
          />
          <span className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-xs font-bold text-white">
            9+
          </span>
        </div> */}
      </div>
      {/* <div className="flex items-center justify-center gap-2 pl-3"> */}
      {/* <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
        >
          <Icons.Share className="stroke-1" />
          <span className="sr-only">Open share UI</span>
        </Button> */}

      {/* </div> */}
    </div>
  );
}
