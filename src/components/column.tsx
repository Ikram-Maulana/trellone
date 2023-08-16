import TodoCard from "@/components/todo-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Todos } from "@prisma/client";
import { DragHandleDots2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { type FC } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface ColumnProps {
  id: string;
  todos: Todos[];
  index: number;
}

const idToColumnText: Record<string, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column: FC<ColumnProps> = ({ id, todos, index }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cn(
                  "rounded-xl border p-2 shadow",
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-zinc-50",
                )}
              >
                <h2 className="flex flex-row items-center justify-between space-y-0 p-4 font-bold">
                  <span className="flex w-full items-center gap-2">
                    <DragHandleDots2Icon className="h-5 w-5 text-gray-400" />
                    {idToColumnText[id]}
                  </span>

                  <span
                    className={cn(
                      "rounded-full bg-gray-200 px-3.5 py-2 text-xs font-normal text-gray-500",
                    )}
                  >
                    {todos.length}
                  </span>
                </h2>

                <div className={cn("space-y-2 p-4 py-0")}>
                  {todos.map((todo, index) => (
                    <Draggable
                      draggableId={`todo-${todo.id}`}
                      index={index}
                      key={todo.id}
                    >
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  <div className="flex items-end justify-end py-4">
                    <Button variant="outline" size="icon">
                      <PlusCircledIcon className="h-5 w-5 text-green-500 hover:text-green-600" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
