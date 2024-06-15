"use client";

import Link from "next/link";

import { CreatePostSchema } from "@acme/db/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@acme/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Icons } from "@acme/ui/icons";
import { Input } from "@acme/ui/input";
import { P, Text } from "@acme/ui/typography";

export const ScriptSearch = () => {
  const form = useForm({
    defaultValues: {
      content: "",
      title: "",
      // searchValue: "",
    },
    schema: CreatePostSchema,
  });

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {
            // createPost.mutate(data);
          })}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex-1 items-center md:grow-0">
                    <Icons.Search className="absolute left-2.5 top-2.5" />
                    <Input
                      {...field}
                      placeholder="Search for a script"
                      className="pl-8 md:w-[200px] lg:w-[336px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <ScriptSearchResults />
    </div>
  );
};

const ScriptSearchResults = () => {
  const results = [
    {
      description: "25",
      title: "King Kong",
    },
    {
      description: "88",
      title: "Godzilla",
    },
  ];
  return (
    <Card className="p-0">
      <CardContent>
        <ul className="flex flex-col gap-1">
          {results.map((result) => (
            <Link
              href={"/scripts/1"}
              key={result.title}
              className="group rounded-lg p-4 hover:bg-muted"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-gray-200"></div>
                  <div>
                    <Text size="lg">{result.title}</Text>
                    <P variant={"muted"}>{result.description}</P>
                  </div>
                </div>
                <div className="hidden group-hover:block">
                  <Icons.ChevronRight />
                </div>
              </div>
            </Link>
            // </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
