"use client";

import authClient from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@repo/ui";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export default function CreateTeam() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("ENV", process.env.NEXT_PUBLIC_ORGANIZATION_SLUG);
    const res = await authClient.organization.getFullOrganization({
      query: {
        organizationSlug: process.env.NEXT_PUBLIC_ORGANIZATION_SLUG,
      },
    });
    if (res.error) {
      throw new Error("Nessuna organizzazione di base");
    }
    console.log("ENV", process.env.NEXT_PUBLIC_ORGANIZATION_SLUG);
    console.log("DATA", res.data);
    const team = await authClient.organization.createTeam({
      name: values.name,
      organizationId: res.data.id,
    });

    console.log(team);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <PlusIcon size={16} className="opacity-60" /> Create Team
        </Button>
      </DialogTrigger>

      <DialogContent className="w-1/3">
        <DialogHeader className="text-left">
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team by filling the form.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Team name" {...field} />
                  </FormControl>
                  <FormDescription>Type the team name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-row justify-end">
              <DialogClose asChild>
                <Button size="sm" type="reset" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>

              <Button size="sm" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
