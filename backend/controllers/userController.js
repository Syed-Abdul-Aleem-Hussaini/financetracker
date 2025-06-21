import { pool } from "../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";



export const getUser  = async (req , res)=>{
 try{
    const {userId} = req.body.user


    const userExist =  await pool.query({
          text: "select * from tbluser where id = $1",
          values: [userId],
        });

    const user = userExist.rows[0]
    
    if (!user) {   
        return res.status(404).json({
          status: "failed",
          message: "user not found !!!",
        });
      }

      user.password  = undefined
      res.status(201).json({
         status : "success",
         user,
      })



 }
 catch(error){
    console.log(error)
    res.status(500).json({status : "failed", message  : error.message})

 }
}


export const updateUser  = async (req , res)=>{
    try{

     const { userId } = req.user; // get userId from middleware

      const {firstname ,lastname,country,currency,contact}  = req.body
      const userExist =  await pool.query({
         text: "select * from tbluser where id = $1",
         values: [userId],
       });

   const user = userExist.rows[0]
   
   if (!user) {   
       return res.status(404).json({
         status: "failed",
         message: "user not found !!!",
       });
     }

     const updatedUser = await pool.query({
      text : `update tbluser set firstname  = $1 ,lastname =  $2, country  = $3,currency  = $4,contact   =$5, updatedat=  CURRENT_TIMESTAMP WHERE id  = $6 RETURNING *`,
      values :[firstname,lastname,country,currency,contact,userId],
     })

     updatedUser.rows[0].password = undefined
     res.status(200).json({
      status :  "success",
      message : "user information updated successfully",
      user :updatedUser.rows[0]
     })


       
    }
    catch(error){
       console.log(error)
       res.status(500).json({status : "failed", message  : error.message})
   
    }
   }





   export const changePassword = async (req, res) => {
    try {
      const userId = req.body.user?.userId;
      const { currentpassword, newpassword, confirmpassword } = req.body;
  
      if (!currentpassword || !newpassword || !confirmpassword) {
        return res.status(400).json({
          status: "failed",
          message: "All password fields are required",
        });
      }
  
      const userExist = await pool.query({
        text: "SELECT * FROM tbluser WHERE id = $1",
        values: [userId],
      });
  
      const user = userExist.rows[0];
  
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found !!!",
        });
      }
  
  
      if (!user.password) {
        return res.status(500).json({
          status: "failed",
          message: "User password not found in database",
        });
      }
  
      const isMatch = await comparePassword(currentpassword, user.password);
  
      if (!isMatch) {
        return res.status(401).json({
          status: "failed",
          message: "Invalid current password",
        });
      }
  
      if (newpassword !== confirmpassword) {
        return res.status(400).json({
          status: "failed",
          message: "New password and confirm password do not match",
        });
      }
  
      const hashedPassword = await hashPassword(newpassword);
  
      await pool.query({
        text: `UPDATE tbluser SET password = $1 WHERE id = $2`,
        values: [hashedPassword, userId],
      });
  
      res.status(200).json({
        status: "success",
        message: "Password updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "failed", message: error.message });
    }
  };
  




// export const signUser  = async (req , res)=>{
//     try{
       
//     }
//     catch(error){
//        console.log(error)
//        res.status(500).json({status : "failed", message  : error.message})
   
//     }
//    }



