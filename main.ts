import { FastMCP } from "fastmcp";
import {
  addExpenseSchema,
  listExpensesSchema,
  updateExpenseSchema,
  deleteExpenseSchema,
  getSummarySchema,
} from "./types";
import {
  addExpense,
  listExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
} from "./tools";

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

server.addTool({
  name: "update-expense",
  description: "Update an existing expense",
  parameters: updateExpenseSchema,
  execute: async (args) => {
    const updated = await updateExpense(args);
    return JSON.stringify(updated, null, 2);
  },
});

server.addTool({
  name: "delete-expense",
  description: "Delete an expense",
  parameters: deleteExpenseSchema,
  execute: async (args) => {
    const deleted = await deleteExpense(args);
    return JSON.stringify(deleted, null, 2);
  },
});

server.addTool({
  name: "get-expenses-summary-by-category",
  description: "Get a summary of expenses grouped by category",
  parameters: getSummarySchema,
  execute: async (args) => {
    const summary = await getSummary(args);
    return JSON.stringify(summary, null, 2);
  },
});

server.start({
  transportType: "stdio",
});
