import { z } from "zod";
import { FastMCP } from "fastmcp";
import { addExpenseSchema } from "./types";
import { addExpense } from "./tools";

const server = new FastMCP({
  name: "Expense tracker",
  version: "1.0.0",
});

server.addTool({
  name: "add-expense",
  description: "Add an expense",
  parameters: addExpenseSchema,
  execute: async (args) => {
    const expense = await addExpense(args);
    return JSON.stringify(expense, null, 2);
  },
});

server.start({
  transportType: "stdio",
});
