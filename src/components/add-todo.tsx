/* eslint-disable @typescript-eslint/no-misused-promises */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useBoardStore } from "@/store/board-store";
import { api } from "@/utils/api";
import { UploadButton } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExclamationTriangleIcon,
  PlusCircledIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useToggle } from "usehooks-ts";
import { z } from "zod";

const idToColumnText: Record<string, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const formSchema = z.object({
  title: z.string().nonempty("Please enter a title for your task."),
  status: z.string().nonempty("Please select a status for your task."),
  image: z.string().optional(),
});

export function AddTodo({ name }: { name: string }) {
  const { data: sessionData } = useSession();
  const { board, setBoardState } = useBoardStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: name,
      image: "",
    },
  });
  const {
    data: statuses,
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses,
  } = api.statuses.getAll.useQuery(undefined, {
    enabled: !!sessionData?.user,
  });
  const { mutate: addTodo, isLoading: isLoadingAddTodo } =
    api.todos.addTodo.useMutation({
      onSuccess: (data) => {
        const { statusName } = data.data;
        const { id, title, statusId, userId, image, createdAt, updatedAt } =
          data.data.newTodo;

        const newColumns = new Map(board?.columns);
        const newTodo = {
          id,
          title,
          statusId,
          image,
          userId,
          createdAt,
          updatedAt,
        };

        const column = newColumns.get(statusName);
        if (!column) return;

        column.todos.push(newTodo);

        setBoardState({
          ...board,
          columns: newColumns,
        });

        setValue(false);
        toast({
          title: "Success",
          description: "Todo added successfully.",
        });
      },
      onError: () => {
        setValue(false);
        toast({
          title: "Error",
          description: "Failed to add todo. Please try again later.",
          variant: "destructive",
        });
      },
    });
  const [value, toggle, setValue] = useToggle();

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTodo({ ...values });
  }

  return (
    <Dialog open={value} onOpenChange={setValue}>
      <DialogTrigger onClick={toggle} asChild>
        <Button variant="outline" size="icon">
          <PlusCircledIcon className="h-5 w-5 text-green-500 hover:text-green-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Task</DialogTitle>
          <DialogDescription>
            Add a task to your board by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter a task here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoadingStatuses && (
              <div className="space-y-2">
                <div className="flex flex-col gap-2 space-y-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      className="h-[50px] rounded-lg border"
                      key={index}
                    />
                  ))}
                </div>
              </div>
            )}
            {isErrorStatuses && (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load statuses data. Please try again later.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {!isLoadingStatuses && !isErrorStatuses && !statuses && (
              <div className="space-y-2">
                <Alert
                  className={cn(
                    "border-amber-500/50 text-amber-500 dark:border-amber-500 [&>svg]:text-amber-500",
                  )}
                >
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    No statuses data found. Please contact the administrator.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {!isLoadingStatuses && !isErrorStatuses && statuses && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={name}
                        className="flex flex-col space-y-1"
                      >
                        {statuses.map((status) => (
                          <FormItem
                            className={cn(
                              "flex cursor-pointer items-center justify-between space-y-0 rounded-lg border bg-card p-4",
                            )}
                            key={`status-${status.id}`}
                          >
                            <FormLabel className="flex-1 cursor-pointer font-normal">
                              {idToColumnText[status.name]}
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem value={status.name} />
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UploadButton
                      {...field}
                      className={cn("rounded-lg border bg-card pb-4 pt-2")}
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res?.[0]?.fileUrl);
                        toast({
                          title: "Success",
                          description: "Image uploaded successfully.",
                        });
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          title: "Error",
                          description: error.message,
                          variant: "destructive",
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoadingAddTodo}>
                {isLoadingAddTodo && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoadingAddTodo ? "Adding..." : "Add todo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
