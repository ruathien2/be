import db from "../models";
import _, { reject } from "lodash";
import emailService from "./emailService";
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.user.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.allcodes,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.allcodes,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.user.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let checkRequiredField = (inputData) => {
  let arrField = ['doctorId', 'contentHTML', 'contentMarkDown', 'action', 'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId']
  let isValid = true
  let element = ''
  for(let i = 0; i < arrField.length; i++) {
    if(!inputData[arrField[i]]) {
      isValid = false
      element = arrField[i]
      break
    }
  }
  return {
    isValid: isValid,
    element: element
  }
}

let saveDetailInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredField(inputData)
      if(checkObj.isValid === false) {
        resolve({
          errCode: -1,     
          errMessage: `Missing parameter: ${checkObj.element}`,
        });
      } else {
        //Upsert to Markdown Table
        if (inputData.action === "CREATE") {
          await db.markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkDown: inputData.contentMarkDown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.markdown.findOne({
            where: {
              doctorId: inputData.doctorId,
            },
            raw: false,
          });

          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkDown = inputData.contentMarkDown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.doctorId = inputData.doctorId;
            doctorMarkdown.updateAt = new Date();

            await doctorMarkdown.save();
          }
        }
        // Upsert to Doctor Information Table
        let doctor_infor = await db.Doctor_infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });

        if (doctor_infor) {
          //Update
          doctor_infor.doctorId = inputData.doctorId;
          doctor_infor.priceId = inputData.selectedPrice;
          doctor_infor.paymentId = inputData.selectedPayment;
          doctor_infor.provinceId = inputData.selectedProvince;

          doctor_infor.nameClinic = inputData.nameClinic;
          doctor_infor.addressClinic = inputData.addressClinic;
          doctor_infor.note = inputData.note;
          doctor_infor.specialtyId = inputData.specialtyId
          doctor_infor.clinicId = inputData.clinicId

          await doctor_infor.save();
        } else {
          // Create
          await db.Doctor_infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            paymentId: inputData.selectedPayment,
            provinceId: inputData.selectedProvince,

            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            // clinicId: inputData.clinicId
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save Info Doctor Successed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing require parameter",
        });
      } else {
        let data = await db.user.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.allcodes,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.allcodes,
                  as: "priceIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.allcodes,
                  as: "paymentIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.allcodes,
                  as: "provinceIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) {
          data = {};
        }

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing require parameter",
        });
      } else {
        let schedule1 = data.arrSchedule;
        if (schedule1 && schedule1.length > 0) {
          schedule1 = schedule1.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        // get all existing data
        let existing = await db.Schedule.findAll({
          where: {
            doctorId: data.doctorId,
            date: data.formatedDate,
          },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        // compare different
        let toCreate = _.differenceWith(schedule1, existing, (a, b) => {
          return a.timeType === b.timeType && a.date === b.date;
        });
        console.log("=======");
        console.log(toCreate);
        // Create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(schedule1);
        }

        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.allcodes,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.user,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            }
          ],
          raw: false,
          nest: true,
        });
        console.log(doctorId, date)

        if (!data) data = [];

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Doctor_infor.findOne({
          where: {
            doctorId: doctorId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.allcodes,
              as: "priceIdTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allcodes,
              as: "paymentIdTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allcodes,
              as: "provinceIdTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.user.findOne({
          where: {
            id: doctorId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.allcodes,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.allcodes,
                  as: "priceIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.allcodes,
                  as: "paymentIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.allcodes,
                  as: "provinceIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) {
          data = {};
        }

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }else{
        let data = await db.bookings.findAll({
          where: {
            statusId: 'S2',
            doctorId: doctorId,
            date: date
          },
          include: [
            {
              model: db.user, as: "patientData",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.allcodes,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                }
              ]
            },
            {
              model: db.allcodes,
                  as: "timeTypeDataPatient",
                  attributes: ["valueEn", "valueVi"],
            }
          ],
          raw: false,
          nest: true
        })

        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

let sendRemedy = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!data.email || !data.doctorId || !data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }else{
      //  update patient status
      let appointment = await db.bookings.findOne({
        where: {
          doctorId: data.doctorId,
          patientId: data.patientId,
          timeType: data.timeType,
          statusId: 'S2'
        },
        raw: false
      })
      if(appointment) {
        appointment.statusId = 'S3'
        await appointment.save()
      }

      // send email remedy
      console.log('check server: ', data)
      await emailService.sendAttachment(data)
      resolve({
        errCode: 0,
        errMessage: 'Ok'
      })
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInfoDoctor: saveDetailInfoDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor, 
  sendRemedy: sendRemedy
};
