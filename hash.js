const bcrypt = require ('bcrypt');
async function run(){
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('1234', salt)

    console.log(salt)
    console.log(hashed)
}
run();


// const jwt = require('jsonwebtoken')
// module.exports= {
//     createHashPassword: (password)=>  
//         bcrypt.hashSync(password, bcrypt.genSaltSync(8)), 
    
//     comparePassword:(passwordUser, passwordDB) =>  
//         bcrypt.compareSync(passwordUser, passwordDB),
        
//     generateToken : (id) =>{
//        return jwt.sign({ id }, process.env.SECRET_KEY , { expiresIn: '1h'})
//     }
// }