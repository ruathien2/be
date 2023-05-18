require("dotenv").config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async(dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
  
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Anh Pham 15 👻" <anhp8505@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông Tin Đặt Lịch Khám Bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend), 
      });

  // async..await is not allowed in global scope, must use a wrapper
};

let getBodyHTMLEmail = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi') {
    result =  `
    <h3>Xin Chào ${dataSend.patientName}</h3>
    <p>Bạn đã nhận được email này vì đã đặt lịch khám bệh online trên Anh Pham 15</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><h4>Thời Gian: ${dataSend.time}</h4></div>
    <div><h4>Bác Sĩ: ${dataSend.doctorName}</h4></div>

    <p>Nếu Các Thông Tin Bên Trên Là Đúng, Vui Lòng Bấm Vào Đường Link Đã Xác Nhận Đặt Lịch Khám Bệnh</p>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click Here</a>
    </div>
    <div>Xin Chân Thành Cảm Ơn !!!</div>
  `
  }
  if(dataSend.language === 'en') {
    result =  `
    <h3>Dear ${dataSend.patientName}</h3>
    <p>Bạn đã nhận được email này vì đã đặt lịch khám bệh online trên Anh Pham 15</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><h4>Thời Gian: ${dataSend.time}</h4></div>
    <div><h4>Bác Sĩ: ${dataSend.doctorName}</h4></div>

    <p>Nếu Các Thông Tin Bên Trên Là Đúng, Vui Lòng Bấm Vào Đường Link Đã Xác Nhận Đặt Lịch Khám Bệnh</p>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click Here</a>
    </div>
    <div>Xin Chân Thành Cảm Ơn !!!</div>
  `
  }
  return result
}

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi') {
    result =  `
    <h3>Xin Chào ${dataSend.patientName}</h3>
    <p>Bạn đã nhận được email này vì đã đặt lịch khám bệh online trên Anh Pham 15 thành công</p>
    <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
    <div><h4>Bác Sĩ: ${dataSend.doctorId}</h4></div>
    <div>Xin Chân Thành Cảm Ơn !!!</div>
  `
  }
  if(dataSend.language === 'en') {
    result =  `
    <h3>Xin Chào ${dataSend.patientName}</h3>
    <p>Bạn đã nhận được email này vì đã đặt lịch khám bệh online trên Anh Pham 15 thành công</p>
    <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
    <div><h4>Bác Sĩ: ${dataSend.doctorId}</h4></div>
    <div>Xin Chân Thành Cảm Ơn !!!</div>
  `
  }
  return result
}

// use attachment nodejs
let sendAttachment = async(dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Anh Pham 15 👻" <anhp8505@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết Quả Đặt Lịch Khám Bệnh", // Subject line
    html: getBodyHTMLEmailRemedy(dataSend), 
    attachments: [ 
      {
        filename: `remedy-#${dataSend.patientId}-${dataSend.patientName}-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split("base64")[1],
        encoding: "base64"
      }
    ]
  });
}

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment
};
