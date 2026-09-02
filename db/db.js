import mongoose from 'mongoose'; //import the mongoose library, Mongoose is what Node/Express backend uses to communicate with MongoDB.

// export so that server.js can iport it to use it.

export const db=async()=>{

	try{

        
		const link = await mongoose.connect(process.env.MONGO_URI);  //process.env.MONGO_URI gets MongoDB connection string from .env file.

         //await means Wait until MongoDB connection succeeds or fails before continuing.

		 //after connection succeeds, Mongoose gives you a connection object

		console.log(`Db connected successfully ${link.connection.host}`);

	}
	catch(err){

		//If MongoDB connection fails, the program enters the catch block.

      console.log(`Error : ${err.message}`);
      process.exit(1);  //It tells Node:  The application cannot continue, so stop the process and report that it failed.


	}
};