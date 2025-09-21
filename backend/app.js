const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');


// Adjust path as needed

app.use(cookieParser()); // 👈 Add this before routes
app.use(express.json());
app.use(cors({
    origin : "https://ai-resume-analyzer-jwb0rxw5s.vercel.app",
    credentials:true,

}))

async function connectDB(){
    await mongoose.connect(process.env.MONGODB_URI)
}

connectDB().then(()=>{
    console.log('Congrats got connected to mongo');
})
.catch((err)=>{
    console.log('Try again some error occured',err);
    
})
// console.log(process.env.MONGODB_URI);


app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./routes/analyze')); // ✅ Your route becomes: /api/analyze
app.use('/api/auth', require('./routes/auth')); // ✅ Your route becomes: /api/analyze


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
