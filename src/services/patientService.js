import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';

let builUrlEmai = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

  return result
}

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(">>check email input: ", data.email);
      if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName || !data.selectedGender || !data.address ) {
        resolve({
          errCode: 1,
          errMess: "Missing Parameter",
        });
      } else {
        
        let token = uuidv4();
        console.log('token: ', token)

        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: builUrlEmai(data.doctorId, token)
        })

        // upsert patient
        let users = await db.user.findOrCreate({
          where: {
            email: data.email,
          },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            address: data.address
          },
        });
        console.log(users);
        // create a bookings record
        if (users && users[0]) {
          await db.bookings.findOrCreate({
            where: {
              patientId: users[0].id,
            },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: users[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token
            },
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postVerifyBookAppointment = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMess: "Missing Parameter",
        });
      }else{
        let appointment = await db.bookings.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: 'S1'
          }, 
          raw: false
        })

        console.log('ceck: ', data.doctorId, data.token, appointment)

        if(appointment) {
          appointment.statusId = 'S2';
          await appointment.save();

          resolve({
            errCode: 0,
            errMess: "Update success",
          });
        }else{
          resolve({
            errCode: 2,
            errMess: "Exits",
          });
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment
};
