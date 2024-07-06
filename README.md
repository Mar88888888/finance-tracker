# Household Finance Management Application

## Overview

This application is designed to help households manage and analyze their finances. It allows users to track income from multiple sources and expenses across various categories. The application provides detailed insights into monthly spending patterns and trends.

## Features

- **Income and Expense Tracking**: Record and categorize all income sources and expenses.
- **Detailed Analysis**: Analyze monthly expenses by categories such as Food, Housing, Clothing, Sports, Leisure, and Others.
- **CRUD Operations**: Add, edit, and delete transactions, family members, and expense categories.
- **Data Visualization**: View detailed transaction tables and filter data to show specific records.

## Technology Stack

- **Client-side**: HTML, CSS, JavaScript
- **Server-side**: Nest.js framework
- **Database Interaction**: TypeORM
- **Database**: PostgreSQL

## Modules

Each entity in the application has its own module that includes a controller, a service, and a repository. The controller handles requests and forwards them to the service, where the main logic and database interactions are performed.

## Directory Structure

```plaintext
├── src
│   ├── modules
│   │   ├── transaction
│   │   ├── family-member
│   │   └── expense-category
│   ├── main.ts
│   └── app.module.ts
├── .env.example
├── .gitignore
└── README.md
```

## Usage

### Adding a Transaction

1. Navigate to the transactions page.
2. Click on "Add Transaction".
3. Fill in the details and save.

### Editing a Transaction

1. Find the transaction you want to edit.
2. Click the "Edit" button.
3. Update the information and save.

### Deleting a Transaction

1. Find the transaction you want to delete.
2. Click the "Delete" button.

### Filtering Transactions

1. Use the filter options available on the transactions page.
2. Apply filters to view specific records.
