import { type Todos } from "@prisma/client";

interface Board {
  columns: Map<string, Column>;
}

interface Column {
  id: string;
  todos: Todos[];
}
