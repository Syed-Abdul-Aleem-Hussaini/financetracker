import express from 'express'
import authRoutes from "./authRoutes.js"
import accountsRoutes from "./accountsRoutes.js"
import transactionRoutes from "./transactionRoutes.js"
 import userRoutes from "./userRoutes.js"


const router = express.Router();

router.use("/auth",authRoutes)
router.use("/user",userRoutes)
 router.use("/account",accountsRoutes)
 router.use("/transaction",transactionRoutes)




export default router;