const CronJob = require("cron").CronJob;
const { PrismaClient } = require("@prisma/client");
const { emailSender } = require("./index");

const client = new PrismaClient();

const day = 24 * 60 * 60 * 1000;
const hours = new Date().getHours();
const minutes = new Date().getMinutes() < 25 > 55 ? 00 : 30;

const checkScheduleIn2Hours = async () =>
  client.schedule.findMany({
    where: {
      date: new Date(),
      time_from: Number(`${hours + 2}${minutes < 9 ? `0${minutes}` : minutes}`),
      fake_data: { not: true },
    },
  });

const checkScheduleInOneDay = async () =>
  client.schedule.findMany({
    where: {
      date: new Date() + day,
      time_from: Number(`${hours}${minutes < 9 ? `0${minutes}` : minutes}`),
      fake_data: { not: true },
    },
  });

const emailServiceJob = new CronJob(
  "30 * * * *",
  async () => {
    console.log("Job started");
    await emailSender(checkScheduleInOneDay(), checkScheduleIn2Hours());
    console.log("Job finished");
  },
  null,
  true,
  "Asia/Novosibirsk"
);

module.exports = {
  emailServiceJob,
};
