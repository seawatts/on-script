import { cn } from "..";
import { Button } from "../button";
import { useHideOnScroll } from "../hooks/use-hide-on-scroll";
import { Icons } from "../icons";
import { DropdownMenuDemo } from "./nav-menu";
import { Search } from "./search";

export function OmniBar() {
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
            <img
              alt="Avatar 3"
              className="rounded-full bg-gray-700 opacity-50"
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
        >
          <Icons.ChevronLeft size="lg" className={"stroke-1"} />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
        >
          <Icons.CircleDot size="lg" className={"stroke-1"} />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          className="rounded-full text-zinc-100 hover:bg-gray-600 hover:text-zinc-100"
          size="icon"
          variant="ghost"
        >
          <Icons.ChevronRight size="lg" className={"stroke-1"} />
          <span className="sr-only">Edit</span>
        </Button>
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

function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}
