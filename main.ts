import { z } from "zod";
import { FastMCP } from "fastmcp";

const server = new FastMCP({
  name: "Expense tracker",
  version: "1.0.0",
});

