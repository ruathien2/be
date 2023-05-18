import doctorService from "../services/doctorService";

let getTopDoctorHome = async(req, res) => {
  let limit = req.query.limit;
  if (!limit) 
    limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response)
  } catch (e) {
    console.log(e)
    return res.status(200).json({
        errCode: -1,
        message: "Error From Server ..."
    })
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let message = await doctorService.getAllDoctors(req.body);
    return res.status(200).json(message);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

let postInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInfoDoctor(req.body)
    return res.status(200).json(response)
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

let getDetailDoctorById = async(req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorById(req.query.id)
    return res.status(200).json(infor)
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

let bulkCreateSchedule = async(req, res) => {
  try {
    let infor = await doctorService.bulkCreateSchedule(req.body)
    return res.status(200).json(infor)
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

let getScheduleByDate = async(req, res) => {
  try {
    let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
    return res.status(200).json(infor)
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

let getExtraInforDoctorById = async(req, res) => {
  try {
    let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId)
    return res.status(200).json(infor)
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

let getProfileDoctorById = async(req, res) => {
  try {
    let infor = await doctorService.getProfileDoctorById(req.query.doctorId)
    return res.status(200).json(infor)
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

let getListPatientForDoctor = async(req, res) => {
  try {
    let infor = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
    return res.status(200).json(infor)
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

let sendRemedy = async(req, res) => {
  try {
    let infor = await doctorService.sendRemedy(req.body)
    return res.status(200).json(infor)
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error From Server'
    })
  }
}

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInfoDoctor: postInfoDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy
};
