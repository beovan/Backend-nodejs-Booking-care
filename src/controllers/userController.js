import userService from '../services/userService';

let handleLogin = async ( req , res) => {
    let email = req.body.email;
    console.log('email', email);
    let password = req.body.password;
    
    if (!email || !password) {
        return res.status(500).json({
            errCode : 1,
            message: 'empty email or password'
        });
        
    }
    let userData = await userService.handleUserLogin(email, password);
    //check email and password
    //compare password
    //return user
    //access_topken: JWT json web token
   return res.status(200).json({
    errCode : userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {}
   });
}


module.exports = {
    handleLogin: handleLogin 
}