import { type Column, type Board } from "@/types/board";
import { create } from "zustand";

type BoardState = {
  board: Board;
  setBoardState: (board: Board) => void;
};

export const useBoardStore = create<BoardState>()((set) => ({
  board: {
    columns: new Map<string, Column>(),
  },
  setBoardState: (board: Board) => set({ board }),
}));
