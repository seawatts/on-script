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

export const JoinReading = () => {
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
                  <div className="flex-1 items-center md:grow-0">
                    <Input
                      {...field}
                      placeholder="Enter Code"
                      className="md:w-[200px] lg:w-[336px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
