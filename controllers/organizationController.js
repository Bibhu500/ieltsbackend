import Organization from "../models/organizationModel.js";
import Teacher from "../models/teacherModel.js";

const createOrganization = async (req, res, next) => {
    const data = req.body;
    try{
        const organization = await Organization.create({
            "name": data.name,
            "address": data.address,
            "organization_head": data.organization_head
        });
        const teacher = await Teacher.findOne({ firebaseId: req.user.uid });
        teacher.organization_id = organization._id;
        await teacher.save();
        res.status(201).json(organization);
    } catch (err) {
        next(err);
    }
}

const getAllOrganization = async (req, res, next) => {
    try{
        const organizations = await Organization.find();
        res.status(200).json(organizations);
    } catch (err) {
        next(err);
    }
}

const joinOrganization = async (req, res, next) => {
    const { organization_id } = req.body;
    try{
        const organization = await Organization.findById(organization_id);
        if(!organization){
            return res.status(404).json({message: "organization not found"})
        }
        const teacher = await Teacher.findOne({ firebaseId: req.user.uid });
        teacher.organization_id = organization_id;
        await teacher.save();
        res.status(200).json({message: "Successfully Joined"});
    } catch (err) {
        if(err.name === "CastError"){
            return res.status(404).json({message: "organization not found"})
        }
        next(err);
    }
}

export { createOrganization, getAllOrganization, joinOrganization };