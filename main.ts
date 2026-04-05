import "dotenv/config";
import {
  FastMCP,
  GoogleProvider,
  getAuthSession,
  type GoogleSession,
} from "fastmcp";
import {
  addExpenseSchema,
  listExpensesSchema,
  updateExpenseSchema,
  deleteExpenseSchema,
  getSummarySchema,
  addFriendSchema,
  createGroupSchema,
  addGroupMemberSchema,
  getExpensesByCategorySchema,
} from "./types";
import {
  addExpense,
  listExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
  addFriend,
  listFriends,
  createGroup,
  listGroups,
  addGroupMember,
  getSplitHistory,
  getSplitHistorySchema,
  settleUp,
  settleSplitSchema,
  getExpensesByCategory,
} from "./tools";
import { resolveUser } from "./lib";

// AUTH PREREQUISITES:
// 1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
// 2. Set BASE_URL in .env (e.g. http://localhost:8000)
// 3. Add {BASE_URL}/auth/callback to Authorized Redirect URIs in Google Cloud Console
//http://localhost:8000/auth/callback
const server = new FastMCP({
  name: "Expense tracker",
  version: "1.0.0",
  auth: new GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    baseUrl: process.env.BASE_URL || "http://localhost:8000",
  }),
});

// Middleware-like function to resolve user from session
async function getCurrentUser(session: any) {
  console.log(
    "getCurrentUser: session received",
    JSON.stringify(session, null, 2),
  );
  const oauthSession = getAuthSession(session);
  console.log(
    "getCurrentUser: oauthSession resolved",
    JSON.stringify(oauthSession, null, 2),
  );
  if (!oauthSession) {
    throw new Error("Unauthorized: No session found");
  }
  const user = await resolveUser(oauthSession as any);
  console.log("getCurrentUser: user resolved", user.id);
  return user.id;
}

server.addTool({
  name: "get-my-profile",
  description:
    "Check your current authentication profile and ensure your user record is initialized.",
  execute: async (_, { session }) => {
    const oauthSession = getAuthSession<GoogleSession>(session);
    if (!oauthSession) {
      return "Error: No active session found. Please log in first.";
    }
    const user = await resolveUser(oauthSession as any);
    return JSON.stringify(
      {
        message: "Successfully synchronized profile.",
        profile: {
          id: user.id,
          email: user.email,
          name: user.name,
          status: user.status,
        },
        sessionInfo: {
          email: oauthSession.email,
          hasClaims: !!oauthSession.claims,
        },
      },
      null,
      2,
    );
  },
});

server.addTool({
  name: "add-expense",
  description:
    "Add an expense (can be split with friends or assigned to a group)",
  parameters: addExpenseSchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    console.log("currentUserId", currentUserId);
    const expense = await addExpense(args, currentUserId);
    return JSON.stringify(expense, null, 2);
  },
});

server.addTool({
  name: "list-expenses",
  description: "List your expenses (scoped to current user)",
  parameters: listExpensesSchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const expensesList = await listExpenses(args, currentUserId);
    return JSON.stringify(expensesList, null, 2);
  },
});

server.addTool({
  name: "update-expense",
  description: "Update an existing expense (must be the payer)",
  parameters: updateExpenseSchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const updated = await updateExpense(args, currentUserId);
    return JSON.stringify(updated, null, 2);
  },
});

server.addTool({
  name: "delete-expense",
  description: "Delete an expense (must be the payer)",
  parameters: deleteExpenseSchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const deleted = await deleteExpense(args, currentUserId);
    return JSON.stringify(deleted, null, 2);
  },
});

server.addTool({
  name: "get-expenses-summary-by-category",
  description: "Get a summary of your expenses grouped by category",
  parameters: getSummarySchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const summary = await getSummary(args, currentUserId);
    return JSON.stringify(summary, null, 2);
  },
});

server.addTool({
  name: "get-expenses-by-category",
  description: "Get a list of your expenses for a specific category",
  parameters: getExpensesByCategorySchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const expenses = await getExpensesByCategory(args, currentUserId);
    return JSON.stringify(expenses, null, 2);
  },
});

server.addTool({
  name: "add-friend",
  description: "Invite a friend by email",
  parameters: addFriendSchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const friendship = await addFriend(args, currentUserId);
    return JSON.stringify(friendship, null, 2);
  },
});

server.addTool({
  name: "list-friends",
  description: "List all your friends and their status",
  execute: async (_, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const friends = await listFriends(currentUserId);
    return JSON.stringify(friends, null, 2);
  },
});

server.addTool({
  name: "create-group",
  description: "Create a group for shared expenses",
  parameters: createGroupSchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const group = await createGroup(args, currentUserId);
    return JSON.stringify(group, null, 2);
  },
});

server.addTool({
  name: "list-groups",
  description: "List all groups you are a member of",
  execute: async (_, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const groups = await listGroups(currentUserId);
    return JSON.stringify(groups, null, 2);
  },
});

server.addTool({
  name: "add-group-member",
  description: "Add a member to a group",
  parameters: addGroupMemberSchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const membership = await addGroupMember(args, currentUserId);
    return JSON.stringify(membership, null, 2);
  },
});

server.addTool({
  name: "get-split-history",
  description: "Get history of split expenses (owed to you or owed by you)",
  parameters: getSplitHistorySchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const history = await getSplitHistory(args, currentUserId);
    return JSON.stringify(history, null, 2);
  },
});

server.addTool({
  name: "settle-split",
  description: "Settle an outstanding split with a friend",
  parameters: settleSplitSchema,
  execute: async (args, { session }) => {
    const currentUserId = await getCurrentUser(session);
    const result = await settleUp(args, currentUserId);
    return JSON.stringify(result, null, 2);
  },
});

server.start({
  transportType: "httpStream",
  httpStream: {
    port: parseInt(process.env.PORT || "8000"),
  },
});
