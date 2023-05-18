import db from "../models/index";

let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||

        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.address
      ) {
        resolve({
          errCode: 1,
          errMess: "Missing Parameter",
        });
      } else {
        console.log(data);
        await db.clinics.create({
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          address: data.address,
          name: data.name,
          image: data.imageBase64,
        });
        resolve({
          errCode: 0,
          errMess: "Success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await db.clinics.findAll({});
        if (data && data.length > 0) {
          data.map((item) => {
            item.image = new Buffer(item.image, "base64").toString("binary");
            return item;
          });
        }
        resolve({
          errCode: 0,
          errMess: "Ok",
          data,
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  let getDetailClinictyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!inputId ) {
          resolve({
            errCode: 1,
            errMess: "Missing Parameter",
          });
        } else {
          let data = await db.clinics.findOne({
            where: {
              id: inputId,
            },
            attributes: ["name", "address","descriptionHTML", "descriptionMarkdown"],
          });
  
          if (data) {
            // find by clinics
            let doctorClinic = [];
            if (location === "ALL") {
              doctorClinic = await db.Doctor_infor.findAll({
                where: {
                  clinicId: inputId,
                },
                // attributes: ["doctorId", "provinceId"],
                attributes: ["doctorId"],
              });
            } else {
              // find by location
              doctorClinic = await db.Doctor_infor.findAll({
                where: {
                  clinicId: inputId,
                },
                // attributes: ["doctorId", "provinceId"],
                attributes: ["doctorId"],
              });
            }
  
            data.doctorClinic = doctorClinic;
          } else {
            data = {};
          }
          resolve({
            errCode: 0,
            errMess: "Ok",
            data,
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };
  

module.exports = {
    createClinic: createClinic, 
    getAllClinic: getAllClinic,
    getDetailClinictyById: getDetailClinictyById
}