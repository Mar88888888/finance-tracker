# Household Finance Management Application

## Overview

This application helps households manage and analyze their finances, allowing users to track expenses, create budgets, manage groups for shared expenses, and gain insights into their spending habits.

## Features

* **Expense Tracking:** Record and categorize expenses with detailed descriptions, amounts, and dates.
* **Budgeting:** Set budgets for different categories and track progress towards goals.
* **Group Management:** Create and manage groups with other users to track shared expenses and settle balances.
* **Customizable Categories:** Create and customize expense categories to match your specific needs.
* **User Authentication:** Secure user accounts with password protection and optional two-factor authentication.

## Planned Features

* **Recurring Transactions:** Schedule recurring transactions for regular income or expenses like rent, subscriptions, or salaries.
* **Data Export:** Export your financial data in various formats (CSV, PDF) for further analysis or record-keeping.
* **Data Visualization:** Analyze spending patterns with charts and graphs that illustrate expense breakdowns and trends over time.
  
## Technology Stack

* **Frontend:** ReactJS
* **Backend:** NestJS
* **Database:** PostgreSQL
* **ORM:** TypeORM

## Getting Started

1. **Clone the repository:** `git clone https://github.com/Mar88888888/finance-tracker.git`
2. **Install dependencies:**
    * Frontend: `cd Client && npm install`
    * Backend: `cd Server && npm install`
3. **Set up environment variables:**
    * Create `.env` files in both `Client` and `Server` directories based on the provided `.env.example` files.
    * Update the environment variables with your database credentials and other relevant settings.
4. **Run the application:**
    * Frontend: `cd Client && npm start`
    * Backend: `cd Server && npm run start:dev`
  
## Server-side Project Structure
```plaintext
├── Client
├── Server
│   ├── dist
│   ├── node_modules
│   └── src
│       ├── groups
│       │   ├── abstracts
│       │   ├── dto
│       │   ├── group.entity.ts
│       │   ├── group.model.ts
│       │   ├── groups.controller.spec.ts
│       │   ├── groups.controller.ts
│       │   ├── groups.module.ts
│       │   ├── groups.service.spec.ts
│       │   └── groups.service.ts
│       ├── guards
│       │   ├── auth.guard.ts
│       │   ├── group-member.guard.ts
│       │   ├── group-owner.guard.ts
│       │   ├── purpose-owner.guard.ts
│       │   └── transaction-owner.guard.ts
│       ├── mail
│       │   └── templates
│       │   ├── mail.module.ts
│       │   ├── mail.service.spec.ts
│       │   └── mail.service.ts
│       ├── purposes
│       │   ├── abstracts
│       │   ├── dto
│       │   ├── purpose.entity.ts
│       │   ├── purpose.model.ts
│       │   ├── purposes.controller.spec.ts
│       │   ├── purposes.controller.ts
│       │   ├── purposes.module.ts
│       │   ├── purposes.service.spec.ts
│       │   └── purposes.service.ts
│       ├── transactions
│       |   ├── abstractions
│       │   ├── dto
│       │   ├── transaction.entity.ts
│       │   ├── transaction.model.ts
│       │   ├── transactions.controller.spec.ts
│       │   ├── transactions.controller.ts
│       |   ├── transactions.module.ts
│       |   ├── transactions.service.spec.ts
│       |   └── transactions.service.ts
│       ├── users
│       ├── app.controller.spec.ts
│       ├── app.controller.ts
│       ├── app.module.ts
│       ├── app.service.ts
│       └── main.ts
│   └── test
└── node_modules
```
