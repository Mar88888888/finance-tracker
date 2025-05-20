# Finance Management Application

## Overview

This application helps to manage and analyze finances, allowing users to track expenses, manage groups for shared expenses and gain insights into their spending habits.

## Features

* **Expense Tracking:** Record and categorize expenses with detailed descriptions, amounts, and dates.
* **Group Management:** Create and manage groups with other users to track shared expenses and settle balances.
* **Customizable Categories:** Create and customize expense categories to match your specific needs.
* **User Authentication:** Secure user accounts with password protection and optional two-factor authentication.
* **Recurring Transactions:** Schedule recurring transactions for regular income or expenses like rent, subscriptions, or salaries.
* **Data Visualization:** Analyze spending patterns with charts and graphs that illustrate expense breakdowns and trends over time.
* **Data Export:** Export your financial data in various formats (CSV, PDF) for further analysis or record-keeping.

  
## Tech Stack

* **Frontend:** ReactJS
* **Backend:** NestJS
* **Database:** PostgreSQL, TypeORM

## How to run in local environment

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
