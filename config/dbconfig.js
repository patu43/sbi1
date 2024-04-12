const mongoose=require('mongoose')

const connectDB = async() =>{

    try{

        const db= process.env.DB_URL;
       await mongoose.connect("mongodb://localhost:27017/SBI")
        console.log("mongoDB connected successfully ....")
    }
    catch(err){
        console.log(err);
        process.exit(1)

 
    }

}
module.exports=connectDB;