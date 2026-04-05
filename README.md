# Expense Tracker MCP Server

A powerful Model Context Protocol (MCP) server for tracking personal expenses, built with [FastMCP](https://github.com/joshua-berry/fastmcp), [Prisma](https://www.prisma.io/), and PostgreSQL.

This server allows AI assistants (like Claude) to manage your expenses directly through a conversational interface, providing capabilities for adding, listing, updating, and summarizing financial data.

## 🚀 Features

- **Add Expenses**: Easily record new transactions with categories and descriptions.
- **List & Filter**: View expenses within custom date ranges and filter by category.
- **Update & Manage**: Modify or delete existing records.
- **Financial Summaries**: Get categorized breakdowns of your spending over time.
- **Prisma Powered**: Robust database interactions with PostgreSQL.

## 🛠️ Prerequisites

- **Node.js**: v18 or later.
- **pnpm**: Recommended package manager.
- **PostgreSQL Database**: A local or cloud PostgreSQL instance.

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd expense-tracker-mcp-server
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your PostgreSQL database connection string:

    ```env
    DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
    ```

4.  **Initialize Database:**
    Push the schema to your PostgreSQL database and generate the Prisma client:
    ```bash
    pnpm db:push
    ```

## 🔌 MCP Configuration

To use this server with an MCP client like **Claude Desktop**, add the following to your configuration file (usually `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "expense-tracker": {
      "command": "npx",
      "args": ["-y", "tsx", "/path/to/expense-tracker-mcp-server/main.ts"],
      "env": {
        "DATABASE_URL": "your-postgres-database-url-here"
      }
    }
  }
}
```

> [!NOTE]
> Ensure you replace `/path/to/expense-tracker-mcp-server` with the actual absolute path to your project.

## 🧰 Available Tools

### `add-expense`

Adds a new expense record.

- **Parameters**:
  - `amount` (number): The expense amount.
  - `category` (string): e.g., "Food", "Transport".
  - `description` (string, optional): Details about the expense.
  - `date` (ISO Date string): The date of the expense.

### `list-expenses`

Lists expenses with optional filters.

- **Parameters**:
  - `category` (string, optional): Filter by category.
  - `startDate` (ISO Date string, optional): Start of the range.
  - `endDate` (ISO Date string, optional): End of the range.

### `update-expense`

Updates an existing expense by ID.

- **Parameters**: `id` (string), and any fields from `add-expense` you wish to change.

### `delete-expense`

Deletes an expense.

- **Parameters**: `id` (string).

### `get-expenses-summary-by-category`

Provides a summary of spending grouped by category.

- **Parameters**:
  - `startDate` (ISO Date string, optional): Start of the range.
  - `endDate` (ISO Date string, optional): End of the range.

## 🛠️ Development

- **Run in Dev Mode**: `pnpm dev`
- **Build**: `pnpm build`
- **Database Studio**: `pnpm db:studio` (Open Prisma Studio to view/edit data manually)
- **Database Push**: `pnpm db:push` (Sync schema changes)
