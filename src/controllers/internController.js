 const CollegeModel= require("../models/collegeModel.js")
 const InternModel = require("../models/internModel.js")
 
 const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === "string"  && value.trim().length === 0) return false
  //  if(typeof value != type ) return false
    return true;
}
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0 
}
const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
 const registerIntern = async function (req,res){
     try{
         const requestBody = req.body;
         if(!isValidRequestBody(requestBody)){
             res.status(400).send({status:false,message:'Invalid request parameters. Please provide intern details'})
         }
         //Extract params
         let {name,email,mobile,collegeName} = requestBody;
         // validation starts
         if(!isValid(name)){
            res.status(400).send({status: false, message: 'Name is required'})
            return
         }
         if(!isValid(email)){
            res.status(400).send({status: false, message: 'Not a Valid E-Mail or E-Mail is required'})
            return
         }
         
         //email validation
         email = email.trim()
         if(!(regex.test(email))) {
            res.status(400).send({status: false, message: `Email should be a valid email address`})
            return
        }
        
        
         if(!isValid(mobile)){
            res.status(400).send({status: false, message: 'Not a valid Mobile number or Number  is required'})
            return
         }
         
         //mobile validation
         mobile = mobile.trim()
         if(!(/^\d{10}$/.test(mobile))){
            res.status(400).send({status: false, message: ` should be a valid mobile number`})
            return
        } 
         
         if(!isValid(collegeName)){
            res.status(400).send({status: false, message: 'Not a valid collegeName or collegeName is required'})
            return
         } 

         const isEmailAlreadyUsed = await InternModel.findOne({email}); // {email: email} object shorthand property

         if(isEmailAlreadyUsed) {
             res.status(400).send({status: false, message: `${email} email address is already registered`})
             return
         }

         const isMobileAlreadyUsed = await InternModel.findOne({mobile}); // {email: email} object shorthand property

         if(isMobileAlreadyUsed) { 
             res.status(400).send({status: false, message: `${mobile} mobile is already registered`})
             return
         }
         const collegeNames = req.body.collegeName
         const college = await CollegeModel.findOne({name:collegeNames}) 
         if (!college) {
            return res.status(404).send({ status: false, message: 'College details not found from your CollegeName' })
        }
        // console.log(college)
         const iD = college._id 
         //console.log(requestBody)
          let collegeId = iD   //Mentor required 
         requestBody.collegeId = iD
         console.log(requestBody)

         const internData = {name,email,mobile,collegeId } //destructuring
         const newIntern = await InternModel.create(internData)
 
         res.status(201).send({status: true,message: `Intern created successfully`,data:newIntern});
       }catch(error){
           res.status(500).send({status:false,message:error.message}) 
       }


     }

 
 module.exports={registerIntern}
