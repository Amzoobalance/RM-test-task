const express = require("express");
const bodyParser = require("body-parser");
const { registerPatient } = require("./endpoints/register-patient");
const { appointmentToDoc } = require("./endpoints/appointment-to-doc");
const { getSchedule } = require("./endpoints/get-schedule");
const { registerMySql } = require("./middleware/register-mysql");
const { PrismaClient } = require("@prisma/client");
const { emailServiceJob } = require("../email-service/cron");
const { sendEmail } = require("../email-service/index");

const client = new PrismaClient();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(registerMySql(client));

app.post("/api/v1/patients", registerPatient);
app.post("/api/v1/appointments", appointmentToDoc);
app.get("/api/v1/schedules/:date", getSchedule);

emailServiceJob.start();

// sendEmail("Андрей", "Терапевт", "930", "amzoo@vk.com", false);

app.listen(process.env.PORT, () =>
  console.log(`API started on port ${process.env.PORT}`)
);
