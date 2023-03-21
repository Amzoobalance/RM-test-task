const fetch = require("node-fetch");

const sendEmail = async (userName, spec, slotTime, email, boolean) => {
  let htmlContent = "";
  if (boolean) {
    htmlContent += `<div><h1>${current_date}</h1><p>Привет ${userName}! Напоминаем что вы записаны к ${spec}у завтра в ${slotTime}!</p></div>`;
  }
  htmlContent += `<div><h1>${current_date}</h1><p>Привет ${userName}! Через 2 часа у вас приём у ${spec}a завтра в ${slotTime}!</p></div>`;

  await fetch(
    "https://api.sendinblue.com/v3/smtp/email",
    {
      method: "post",
      sender: {
        name: "Andrey Orlov",
        email: "krotocat@gmail.com",
      },
      to: {
        email,
        name: userName,
      },
      subject: "Запись к врачу!",
      htmlContent,
    },
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.SENDINBLUE_API_KEY,
      },
    }
  ).catch(console.log);
};

const emailSender = async (appointmentsAfterDay, appointmentsAfterTwoHours) => {
  if (
    appointmentsAfterDay.length === 0 &&
    appointmentsAfterTwoHours.length === 0
  ) {
    return;
  }
  if (appointmentsAfterDay.length > 0) {
    for (let appointment of appointmentsAfterDay) {
      await sendEmail(
        appointment.name,
        appointment.spec,
        appointment.time_from,
        appointment.email,
        true
      );
    }
  }
  if (appointmentsAfterTwoHours.length > 0) {
    for (let appointment of appointmentsAfterDay) {
      await sendEmail(
        appointment.name,
        appointment.spec,
        appointment.time_from,
        appointment.email,
        false
      );
    }
  }
};

module.exports = {
  emailSender,
};

// const SibApiV3Sdk = require("sib-api-v3-sdk");
// const defaultClient = SibApiV3Sdk.ApiClient.instance;

// const apiKey = defaultClient.authentications["api-key"];
// apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

// const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

// sendSmtpEmail = {
//   to: [
//     {
//       email: email,
//       name: userName,
//     },
//   ],
//   templateId: 59,
//   params: {
//     name: "userName",
//     surname: "",
//   },
//   headers: {
//     accept: "application/json",
//     "content-type": "application/json",
//     "api-key": process.env.SENDINBLUE_API_KEY,
//   },
// };

// apiInstance.sendTransacEmail(sendSmtpEmail).then(
//   function () {
//     console.log("Notification email has been sent successfully");
//   },
//   function (error) {
//     console.error(error);
//   }
// );
