require('./db/connection')
const express = require('express');
const app = express();
const tasks = require('./routes/task');
const connectDB = require('./db/connection')
const {notFound} = require('./middleware/not_found')
const errorHandlerMiddleware = require('./middleware/error_handler')

require('dotenv').config()

//middleware
app.use(express.static('./public'))
app.use(express.json())
app.use('/api/v1/tasks',tasks)
app.use(notFound)
app.use(errorHandlerMiddleware)
const port = 3000;


const start = async()=>{
  try{
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch(error){
    console.log(error)
  }
}


start()
