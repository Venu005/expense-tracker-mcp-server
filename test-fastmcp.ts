import { FastMCP } from "fastmcp";
const server = new FastMCP({ name: "test", version: "1.0.0" });
console.log(server.start.toString());
