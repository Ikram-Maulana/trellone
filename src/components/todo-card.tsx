import BlurImage from "@/components/blur-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useBoardStore } from "@/store/board-store";
import { api } from "@/utils/api";
import { type Todos } from "@prisma/client";
import { CrossCircledIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { type FC } from "react";
import {
  type DraggableProvidedDragHandleProps,
  type DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

interface TodoCardProps {
  todo: Todos;
  index: number;
  id: string;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  refetchBoardData: () => void;
}

const TodoCard: FC<TodoCardProps> = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
  refetchBoardData,
}) => {
  const { board, setBoardState } = useBoardStore();
  const { mutate: deleteTodo } = api.todos.deleteTodo.useMutation({
    onError: () => {
      refetchBoardData();
    },
  });

  const onDeleteTodo = (todoId: string) => {
    const newColumns = new Map(board.columns);
    newColumns.get(id)?.todos.splice(index, 1);

    deleteTodo({
      todoId,
    });

    setBoardState({ ...board, columns: newColumns });

    toast({
      title: "Todo deleted",
      description: "Your todo has been deleted from the board.",
    });
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="space-y-2 rounded-lg border bg-card drop-shadow"
    >
      <div className="grid w-full grid-cols-8 items-center p-4">
        <DragHandleDots2Icon className="h-5 w-5 text-gray-400" />
        <p className="col-span-5">{todo.title}</p>
        <div className="col-span-2 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="text-red-500 hover:text-red-600"
              >
                <CrossCircledIcon className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your todo from the board.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteTodo?.(todo.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {todo.image && (
        <div className="h-full w-full overflow-hidden rounded-b-md">
          <BlurImage
            src={todo.image}
            alt={todo.title}
            height={200}
            width={400}
            className="h-52 w-full rounded-b-md bg-zinc-200 object-cover"
            unoptimized
            blurDataURL={todo.blurHash as string}
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
            loader={({ src }) => src}
          />
        </div>
      )}
    </div>
  );
};

export default TodoCard;
