import { pool } from "../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";

export const signupUser = async (req, res) => {
  try {
    const { firstName, email, password, provider, uid } = req.body;
    
    console.log('Received signup request:', { firstName, email, provider, uid });
    
    if (!firstName || !email) {
      return res.status(400).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const userExist = await pool.query({
      text: "SELECT EXISTS (SELECT 1 FROM tbluser WHERE email = $1)",
      values: [email],
    });

    if (userExist.rows[0].exists) {   
      // If user exists, return success with user data
      const existingUser = await pool.query({
        text: "SELECT * FROM tbluser WHERE email = $1",
        values: [email],
      });
      
      const token = createJWT(existingUser.rows[0].id);
      existingUser.rows[0].password = undefined;

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        user: existingUser.rows[0],
        token,
      });
    }

    // For social auth users, use a random password
    const hashedPassword = password ? await hashPassword(password) : await hashPassword(Math.random().toString(36));

    try {
      const newUser = await pool.query({
        text: "INSERT INTO tbluser (firstname, email, password, provider, uid) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        values: [firstName, email, hashedPassword, provider || 'local', uid || null],
      });

      newUser.rows[0].password = undefined;
      const token = createJWT(newUser.rows[0].id);

      res.status(201).json({
        status: "success",
        message: "User account created successfully",
        user: newUser.rows[0],
        token,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        status: "failed", 
        message: "Error creating user account",
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query({
      text: "SELECT * FROM tbluser WHERE email = $1",
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const token = createJWT(user.id);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};















// export const signinUser  = async(req,res)  =>{
//     try{
       

//     }
//     catch(error){
//        console.log(error)
//        res.status(500).json({status :"failed", message : error.message});
//     }

// }