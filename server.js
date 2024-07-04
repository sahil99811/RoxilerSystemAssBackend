const express=require('express');
const app=express();
const {dbConnect}=require('./config/dbConnect')
const authRoutes=require('./routes/Auth');
const storeRoutes=require('./routes/Store');
const userRoutes=require('./routes/User')
const dotenv=require('dotenv');
const cors=require('cors');
dotenv.config();

app.use(cors({origin:"*"}));

app.use(express.json());
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/store',storeRoutes);
dbConnect()
.then(()=>{
       console.log("Database connected successfully");

        // Start the server on the port defined in environment variables
        const server = app.listen(process.env.PORT, () => {
            console.log("Server is started");
        });

        // Handle server startup errors
        server.on('error', (error) => {
            console.error("Server failed to start:", error);
            process.exit(1); // Exit the process with a failure code
        });
})
.catch((error)=>{
    console.error("DB Connection Failed:", error);
    process.exit(1); // Exit the process with a failure code
})
