import { Notification } from "../models/notificationModel.js";
import asyncHandler from "express-async-handler";
import { Writing } from "../models/writingModel.js";
import User from "../models/userModel.js";
import Speaking from "../models/speakingModel.js";

const sendRequest = asyncHandler(async (req, res, next) => {
    const data = req.body;
    try {
        const sender_id = req.user.uid;
        const receiver_id = data.user_id;
        const result_id = data._id;
        const message_type = data.message_type;
        const result_link = `http://localhost:5173/${message_type}/share/${data.share_id}`
        const status = "requested";
        const senderUser = await User.findOne({"firebaseId": sender_id}); 
        const sender_name = senderUser.fullName;
        console.log(sender_name)
        const check = await Notification.findOne({
            sender_id,
            result_id
        })
        if(check){
            res.status(409).json({
                message: "already exists",
                data: check
              });
        }else{
            const notification = await Notification.create({
                sender_id,
                sender_name,
                receiver_id,
                result_id,
                result_link,
                message_type,
                status
            });
            console.log(notification);
            res.status(201).json({
                message: "saved",
                data: notification
            });
        }
    } catch (e) {
      next(e);
    }
  });

  const acceptRequest = asyncHandler(async (req, res, next) => {
    const data = req.body.data;
    try {
        console.log(data)
        const notification_id = data.notification_id;
        const result_id = data.result_id;
        const sender_id = data.sender_id;
        const receiver_id = req.user.uid;
        const message_type = data.message_type;
        const status = "accepted";
        const receiverUser = await User.findOne({"firebaseId": receiver_id}); 
        const receiver_name = receiverUser.fullName;
        let result = "";
        if(message_type==="writing"){
            result = await Writing.findOne({ _id: result_id, user_id: receiver_id });
        }else if(message_type == "speaking"){
          result = await Speaking.findOne({ _id: result_id, user_id: receiver_id });
        }
        if(!result){
          res.json({"message": "Invalid result"})
        }
        console.log(result);
        result.editor_id = sender_id;
        await result.save();
        const notification = await Notification.create({
            sender_id: receiver_id,
            sender_name: receiver_name,
            receiver_id: sender_id,
            result_id,
            result_link: data.result_link,
            message_type,
            status
        });
        await Notification.deleteOne({_id: notification_id});
        res.status(201).json({
            message: "approved",
            data: notification
        });

    } catch (e) {
      next(e);
    }    
  });

  const rejectRequest = asyncHandler(async (req, res, next) => {
    const data = req.body.data;
    try {
        const notification_id = data.notification_id;
        const result_id = data.result_id;
        const sender_id = data.sender_id;
        const receiver_id = req.user.uid;
        const message_type = data.message_type;
        const status = "rejected";
        const receiverUser = await User.findOne({"firebaseId": receiver_id}); 
        const receiver_name = receiverUser.fullName;
        const notification = await Notification.create({
            sender_id: receiver_id,
            sender_name: receiver_name,
            receiver_id: sender_id,
            result_id,
            result_link: data.result_link,
            message_type,
            status
        });
        await Notification.deleteOne({_id: notification_id});
        res.status(201).json({
            message: "Rejected",
            data: notification
        });
    } catch (e) {
      next(e);
    }    
  });

  const getAllNotifications = asyncHandler(async (req, res, next) => {
    try {
        const notifications = await Notification.find({
          receiver_id: req.user.uid
        });
        res.status(201).json(notifications);
    } catch (e) {
      next(e);
    } 
  })

  const deleteNotification = async (req, res, next) => {
    const { _id } = req.body;
    try{
      const notification = await Notification.findByIdAndDelete(_id);
      if(req.user.uid !== notification.receiver_id){
        return res.status(401).json({message: "Unauthorized User"})
      }
      res.status(204).json({message: "Successfully Deleted"});
    } catch (err) {
      next(err);
    }
  }

export{sendRequest, acceptRequest, rejectRequest, getAllNotifications, deleteNotification};