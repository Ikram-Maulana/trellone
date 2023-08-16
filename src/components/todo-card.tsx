import { Button } from "@/components/ui/button";
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
}

const TodoCard: FC<TodoCardProps> = ({
  todo,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
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
          <Button
            variant="outline"
            size="icon"
            className="text-red-500 hover:text-red-600"
          >
            <CrossCircledIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Add image here ... */}
    </div>
  );
};

export default TodoCard;
