const CollegeModel = require("../models/collegeModel.js");
const internModel = require("../models/internModel.js");

const isValid = function (value, type) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === type && value.trim().length === 0) return false
    if(typeof value != type ) return false 
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
// const isValidName = function (value) {
//     if (typeof value === 'undefined' || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0 || value.trim().split(" ").length > 1) return false
//     return true;
// }


const registerCollege = async function (req, res) {
    try {
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide College details' })
            return
        }
        //Extract params
        const { name, fullName, logoLink } = requestBody; //destructuring

        // Validation starts
        if (!isValid(name, "string")) {
            res.status(400).send({ status: false, message: 'Not a Valid Name or name is required' })
            return
        }
        if (!isValid(fullName, "string")) {
            res.status(400).send({ status: false, message: 'Not a Valid Full name or Full name is required' })
            return
        }
        if (!isValid(logoLink, "string")) {
            res.status(400).send({ status: false, message: 'Not a Valid Logo  link or Logo Link is required' })
            return
        }
        const isNameAlreadyUsed = await CollegeModel.findOne({ name });

        if (isNameAlreadyUsed) {
            res.status(400).send({ status: false, message: `${name} name is already registered` })
        }

        const collegeData = { name, fullName, logoLink } //
        const newCollege = await CollegeModel.create(collegeData)

        res.status(201).send({ status: true, message: `College created successfully`, data: newCollege });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
//***************************************************GET COLLEGE DETAILS */********************* */

const collegeDetails = async function (req, res) {
    try {
        //validation starts

        const query1 = req.query
        if (!isValidRequestBody(query1)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide College name' })

        }
        const collegeNames = req.query.collegeName
        if (!isValid(collegeNames,"string")) {
            return res.status(400).send({ status: false, message: 'Not a valid name' })
        }


        const collegedetail = await CollegeModel.findOne({ name: collegeNames,isDeleted:false })
        if (!collegedetail) {
            return res.status(400).send({ status: false, message: 'No college found with this name' })

        }


        //console.log(collegedetail)
        const ID = collegedetail._id
        console.log(ID)
        const interns = await internModel.find({ 
            collegeId: ID,isDeleted:false }).select({ name: 1, email: 1, mobile: 1, _id: 1 })
        //console.log(interns)
        if (interns.length === 0) {
            let arr = {
                name: collegedetail.name,
                fullName: collegedetail.fullName,
                logoLink: collegedetail.logoLink,
                interns: "No one apllied in this college"
            }

            // []
            return res.status(200).send({ status: true, data: arr })
        }
        let arr = {
            name: collegedetail.name,
            fullName: collegedetail.fullName,
            logoLink: collegedetail.logoLink,
            interns: interns
        }


        res.status(200).send({ status: true, data: arr })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })

    }
}




module.exports = { registerCollege, collegeDetails }


















