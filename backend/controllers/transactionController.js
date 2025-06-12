import express from "express";
import { getMonthName } from "../libs/index.js";
import { pool } from "../libs/database.js";




export const getTransactions = async (req, res) => {
    try {
      const today = new Date();
      const _sevenDaysAgo = new Date(today);
      _sevenDaysAgo.setDate(today.getDate() - 7);
      const sevenDaysAgo = _sevenDaysAgo.toISOString().split("T")[0];
  
      const { df, dt, s } = req.query;
      const userId = req.user?.userId; 
  
      const startDate = new Date(df ? new Date(df).toISOString() : new Date(sevenDaysAgo + "T00:00:00Z"));
      const endDate = new Date(dt ? new Date(dt).toISOString() : new Date().toISOString());
  
  
      const searchFilter = s ? `AND (description ILIKE '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%')` : '';
  
      const queryText = `
        SELECT * FROM tbltransaction 
        WHERE user_id = $1 
        AND createdat BETWEEN $2 AND $3 
        ${searchFilter} 
        ORDER BY id DESC
      `;
  
      const values = s ? [userId, startDate, endDate, s] : [userId, startDate, endDate];
  
  
      const transactions = await pool.query({ text: queryText, values });
  
  
      res.status(200).json({ status: "success", transactions: transactions.rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: error.message });
    }
  };
  
  










  export const getDashboardInformation = async (req, res) => {
    try {
        const userId = req.user?.userId;

        let totalIncome = 0;
        let totalExpense = 0;

        // 🛠 Fix: Ensure SUM(amount) never returns NULL
        const transactionResult = await pool.query({
            text: `SELECT type, COALESCE(SUM(amount), 0) AS totalAmount 
                   FROM tbltransaction 
                   WHERE user_id = $1 
                   GROUP BY type`,
            values: [userId],
        });

        const transactions = transactionResult.rows;

        transactions.forEach(transaction => {
            if (transaction.type === "income") {
                totalIncome += Number(transaction.totalamount); // Convert to Number
            } else {
                totalExpense += Number(transaction.totalamount);
            }
        });

        const availableBalance = totalIncome - totalExpense;

        const year = new Date().getFullYear();
        const start_Date = new Date(year, 0, 1);
        const end_Date = new Date(year, 11, 31, 23, 59, 59);

        // 🛠 Fix: Ensure type is grouped correctly
        const result = await pool.query({
            text: `SELECT extract(month FROM createdat) AS month, type, COALESCE(SUM(amount), 0) AS totalAmount 
                   FROM tbltransaction 
                   WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 
                   GROUP BY month, type`,
            values: [userId, start_Date, end_Date],
        });

        const data = new Array(12).fill().map((_, index) => {
            const monthData = result.rows.filter(item => parseInt(item.month) === index + 1);

            const income = monthData.find(item => item.type === 'income')?.totalamount || 0;
            const expense = monthData.find(item => item.type === 'expense')?.totalamount || 0;

            return {
                label: getMonthName(index),
                income: Number(income),
                expense: Number(expense)
            };
        });

        const lastTransactionsResult = await pool.query({
            text: `SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY id DESC LIMIT 5`,
            values: [userId],
        });
        const lastTransactions = lastTransactionsResult.rows;

        const lastAccountResult = await pool.query({
            text: `SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY id DESC LIMIT 4`,
            values: [userId],
        });
        const lastAccount = lastAccountResult.rows;

        res.status(200).json({
            status: "success",
            availableBalance,
            totalIncome,
            totalExpense,
            chartData: data,
            lastTransactions,
            lastAccount,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};





export const addTransactions = async (req, res) => {
    try {
        const userId = req.user?.userId; // Extract user ID from request

        // Extract parameters and body data
        const { account_id } = req.params;
        const { description, source, amount } = req.body;

        // Log received data for debugging
        console.log("🔍 Debug: Received account_id:", account_id);
        console.log("🔍 Debug: Received body data:", { description, source, amount });

        // Validate required fields
        if (!description || !source || !amount) {
            return res.status(400).json({ status: "failed", message: "Provide required fields!" });
        }

        const newAmount = Number(amount);
        if (newAmount <= 0) {
            return res.status(400).json({ status: "failed", message: "Amount must be greater than 0!" });
        }

        // Fetch account info
        const result = await pool.query({
            text: `SELECT * FROM tblaccount WHERE id = $1`,
            values: [Number(account_id)], // Ensure account_id is a number
        });

        console.log("🔍 Debug: Account Query Result:", result.rows);

        const accountInfo = result.rows[0];

        // Check if account exists
        if (!accountInfo) {
            return res.status(404).json({ status: "failed", message: "Invalid account information. No matching record found." });
        }

        // Check account balance
        if (accountInfo.account_balance <= 0 || accountInfo.account_balance < newAmount) {
            return res.status(403).json({ status: "failed", message: "Transaction failed. Insufficient account balance." });
        }

        // Begin transaction
        await pool.query("BEGIN");

        // Deduct amount from account
        await pool.query({
            text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = current_timestamp WHERE id = $2`,
            values: [newAmount, account_id],
        });

        // Insert transaction record
        await pool.query({
            text: `INSERT INTO tbltransaction (user_id, description, type, status, amount, source) 
                   VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [userId, description, "expense", "completed", newAmount, source],
        });

        // Commit transaction
        await pool.query("COMMIT");

        // Send success response
        res.status(201).json({
            status: "success",
            message: "Transaction completed successfully",
        });

    } catch (error) {
        // Handle errors
        console.error("❌ Error:", error.message);
        await pool.query("ROLLBACK"); // Rollback transaction in case of failure
        res.status(500).json({ status: "failed", message: error.message });
    }
};











export const transferMoneyToAccount = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { from_account, to_account, amount } = req.body;

        if (!(from_account && to_account && amount)) {
            return res.status(403).json({
                status: "failed",
                message: "Provide required fields"
            });
        }

        const newAmount = Number(amount);
        if (newAmount <= 0) {
            return res.status(403).json({
                status: "failed",
                message: "Amount should be greater than 0"
            });
        }

        // Fetch 'from' account
        const fromAccountResult = await pool.query({
            text: `SELECT * FROM tblaccount WHERE id = $1`,
            values: [from_account]
        });

        const fromAccount = fromAccountResult.rows[0];
        if (!fromAccount) {
            return res.status(403).json({
                status: "failed",
                message: "From account not found"
            });
        }

        if (newAmount > fromAccount.account_balance) {
            return res.status(403).json({
                status: "failed",
                message: "Transfer failed. Insufficient balance"
            });
        }

        // Fetch 'to' account
        const toAccountResult = await pool.query({
            text: `SELECT * FROM tblaccount WHERE id = $1`,
            values: [to_account]
        });

        const toAccount = toAccountResult.rows[0];
        if (!toAccount) {
            return res.status(403).json({
                status: "failed",
                message: "To account not found"
            });
        }

        // Begin transaction
        await pool.query("BEGIN");

        // Deduct money from sender
        await pool.query({
            text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = current_timestamp WHERE id = $2 RETURNING *`,
            values: [newAmount, from_account]
        });

        // Add money to receiver
        await pool.query({
            text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = current_timestamp WHERE id = $2 RETURNING *`,
            values: [newAmount, to_account]
        });

        // Log transactions
        const description = `Transfer (${fromAccount.account_name} → ${toAccount.account_name})`;
        await pool.query({
            text: `INSERT INTO tbltransaction (user_id, description, type, status, amount, source) VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [userId, description, "expense", "completed", amount, fromAccount.account_name]
        });

        const description1 = `Received (${fromAccount.account_name} → ${toAccount.account_name})`;
        await pool.query({
            text: `INSERT INTO tbltransaction (user_id, description, type, status, amount, source) VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [userId, description1, "income", "completed", amount, toAccount.account_name]
        });

        // Commit transaction
        await pool.query("COMMIT");

        res.status(201).json({
            status: "success",
            message: "Transfer completed successfully"
        });

    } catch (error) {
        await pool.query("ROLLBACK");  // Rollback in case of an error
        res.status(500).json({ status: "failed", message: error.message });
    }
};
