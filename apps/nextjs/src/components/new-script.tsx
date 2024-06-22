"use client";

import { CreateScriptSchema } from "@on-script/db/schema";
import { Button } from "@on-script/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@on-script/ui/form";
import { Input } from "@on-script/ui/input";
import { toast } from "@on-script/ui/toast";

import { api } from "~/trpc/react";

export const NewScript = () => {
  const form = useForm({
    defaultValues: {
      // content: "",
      title: "",
    },
    schema: CreateScriptSchema,
  });

  const scrapeUrl = api.script.scrapeUrl.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Scraped successfully");
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(async (data) => {
          await scrapeUrl.mutateAsync({ url: data.title });
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex-1 items-center md:grow-0">
                  <Input
                    {...field}
                    placeholder="Enter URL"
                    className="md:w-[200px] lg:w-[336px]"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Scrape URL</Button>
      </form>
    </Form>
  );
};
