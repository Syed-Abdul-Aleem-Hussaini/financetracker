import { pool } from "../libs/database.js";

export const getAccounts  =async(req,res)  =>{
    try{



        const userId = req.user?.userId; 
        const accounts  = await pool.query({
            text : `select * from tblaccount WHERE user_id  =$1`,
            values : [userId],

        })
        res.status(200).json({
            status : "success",
            data :accounts.rows,
        })

        





    }catch(error){

        console.log(error)
        res.status(500).json({
            status : "failed", message :error.message
        })

    }
}


export const createAccount = async (req, res) => {
    try {
      const userId = req.user?.userId; 
      const { name, amount, accountNumber } = req.body;


      if (!userId || !req.body.name || !req.body.accountNumber || !req.body.amount) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required fields: name, accountNumber, amount",
        });
      }
  
  
     
      const accountExistQuery = {
        text: `SELECT * FROM tblaccount WHERE account_name = $1 AND user_id = $2`,
        values: [name, userId],
      };
      const accountExistResult = await pool.query(accountExistQuery);
  
      if (accountExistResult.rows.length > 0) {
        return res.status(409).json({
          status: "failed",
          message: "Account already exists",
        });
      }
  
     
      const createAccountResult = await pool.query({
        text: `INSERT INTO tblaccount (user_id, account_name, account_number, account_balance) 
               VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [userId, name, accountNumber, amount],
      });
  
      const account = createAccountResult.rows[0];
  
      
      const updateUserAccountQuery = {
        text: `UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedat = current_timestamp 
               WHERE id = $2 RETURNING *`,
        values: [[name], userId],
      };
      await pool.query(updateUserAccountQuery);
  
     
      const description = `${account.account_name} (initial deposit)`;
      const initialDepositQuery = {
        text: `INSERT INTO tbltransaction (user_id, description, type, status, amount, source) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        values: [userId, description, "income", "completed", amount, account.account_name],
      };
      await pool.query(initialDepositQuery);
  
      res.status(201).json({
        status: "success",
        message: `${account.account_name} account created successfully`,
        data: account,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  };
  


  





  export const addMoneyToAccount = async (req, res) => {
    try {
        const userId = req.user?.userId; 
        const { id } = req.params;  // Get account ID from the URL
        const { amount } = req.body; // Get amount from body

        console.log("Account ID from request:", id);
        console.log("User ID from token:", userId);

        if (!id || !amount) {
            return res.status(400).json({ status: "failed", message: "Missing required fields: id, amount" });
        }

        const newAmount = Number(amount);

        // 🛠 Check if the account exists and belongs to the user
        const accountCheck = await pool.query({
            text: `SELECT * FROM tblaccount WHERE id = $1 AND user_id = $2`,
            values: [id, userId]
        });

        if (accountCheck.rowCount === 0) {
            return res.status(404).json({ status: "failed", message: "Account not found or does not belong to the user" });
        }

        // ✅ Update account balance
        const result = await pool.query({
            text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = current_timestamp WHERE id = $2 RETURNING *`,
            values: [newAmount, id]
        });

        const accountInformation = result.rows[0];

        const description = `${accountInformation.account_name} (deposit)`;

        // ✅ Insert transaction
        const transQuery = {
            text: `INSERT INTO tbltransaction (user_id, description, type, status, amount, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: [
                userId,
                description,
                "income",
                "completed",
                newAmount,
                accountInformation.account_name
            ]
        };

        await pool.query(transQuery);

        res.status(201).json({
            status: "success",
            message: `Money added successfully to ${accountInformation.account_name}`,
            data: accountInformation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};


