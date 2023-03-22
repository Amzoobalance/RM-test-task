const SibApiV3Sdk = require("sib-api-v3-sdk");

const sendEmail = async (userName, spec, slotTime, email, boolean) => {
  let htmlContent = "";
  if (boolean) {
    htmlContent += `<div><h1>${new Date()}</h1><p>Привет ${userName}! Напоминаем что вы записаны к ${spec}у завтра в ${slotTime}!</p></div>`;
  }
  htmlContent += `<div><h1>${new Date()}</h1><p>Привет ${userName}! Через 2 часа у вас приём у ${spec}a завтра в ${slotTime}!</p></div>`;
  const defaultClient = SibApiV3Sdk.ApiClient.instance;

  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail = {
    sender: {
      name: "Andrey Orlov",
      email: "krotocat@gmail.com",
    },
    to: [
      {
        email: email,
        name: userName,
      },
    ],
    htmlContent,
    subject: "У вас запись к врачу!",
    params: {
      name: userName,
      surname: "",
    },
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.SENDINBLUE_API_KEY,
    },
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function () {
      console.log(
        `Notification email has been sent successfully to ${email} from ${sendSmtpEmail.sender.email}`
      );
    },
    function (error) {
      console.error(error);
    }
  );
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
  sendEmail,
  emailSender,
};
