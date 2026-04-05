import { FastMCP } from "fastmcp";
import { addExpenseSchema, listExpensesSchema } from "./types";
import { addExpense, listExpenses } from "./tools";

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

server.addTool({
  name: "list-expenses",
  description: "List all the expenses in a date range",
  parameters: listExpensesSchema,
  execute: async (args) => {
    const expensesList = await listExpenses(args);
    return JSON.stringify(expensesList, null, 2);
  },
});

server.start({
  transportType: "stdio",
});
