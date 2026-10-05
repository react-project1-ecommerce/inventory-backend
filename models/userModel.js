import mongoose from 'mongoose';


const userSchema = mongoose.Schema({

     name:{

     	type: String,
     	unique:true,
     	required:true,
     },
     email:{

     	type:String,
     	reqired:true,
     	unique:true,
     },
     password:{

     	type:String,
        required:true,
     },
    department:{
        
        type:String,
        required:true,
        enum:{

        	values:[ "Management",
    "Accounts",
    "Procurement",
    "Warehouse",
    "Production",
    "Maintenance",
    "Sales"],
        	message: "Please add User Department",

        }
    },
    isAdmin:{

       type:Boolean,
       required:true,
       default:false,

    },
    procurement:{

       type:Boolean,
       required:true,
       default:false,

    },
},{

	timestamps:true,
});

const User = mongoose.model("User", userSchema);

export default User;