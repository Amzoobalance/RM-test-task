const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const client = new PrismaClient();

const threeDays = 1000 * 60 * 60 * 72;
const timeSlots = [
  900, 930, 1000, 1030, 1100, 1130, 1200, 1230, 1300, 1330, 1400, 1430, 1500,
  1530, 1600, 1630, 1700, 1730, 1800, 1830, 1900, 1930, 2000, 2030,
];
const specs = [
  "Терапевт",
  "Педиатр",
  "ЛОР",
  "Офтальмолог",
  "Хирург",
  "Дерматовенеролог",
  "Невролог",
  "Стоматолог",
];

const randomSpec = () => {
  const randomNumber = Math.floor(Math.random() * 8);
  return specs[randomNumber];
};

const createRandomDoctor = () => {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    spec: randomSpec(),
    price: faker.datatype.number({ min: 500, max: 4000 }),
  };
};

const createRandomPatient = () => {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.fullName({ sex: this.gender }),
    phone: faker.phone.number("+7 ### ### ## ##"),
    email: faker.internet.email(),
    gender: faker.name.sexType(),
  };
};

const createRandomAppointment = (docId, patientId) => {
  const index = faker.datatype.number({ min: 0, max: timeSlots.length - 1 });

  return {
    id: faker.datatype.uuid(),
    date: faker.date.between(new Date() - threeDays, new Date() + threeDays),
    doctor_id: docId,
    patient_id: patientId,
    time_from: timeSlots[index],
    time_to: timeSlots[index + 1] ?? 2100,
    type: Math.floor(Math.random() * 2),
    is_free: false,
    fake_data: true,
  };
};

const doctors = [];
const patients = [];
const appointments = [];

const generateFakeData = () => {
  if (Math.floor(Math.random() * 2) || patients.length === 0) {
    const patient = createRandomPatient();
    patients.push(patient);
  }

  if (Math.floor(Math.random() * 2) || doctors.length === 0) {
    const doctor = createRandomDoctor();
    doctors.push(doctor);
  }

  const randomPatient = faker.helpers.arrayElement(patients);
  const randomDoctor = faker.helpers.arrayElement(doctors);
  const appointment = createRandomAppointment(
    randomDoctor.id,
    randomPatient.id
  );

  appointments.push(appointment);
};
for (let i = 0; i < 100; i++) {
  generateFakeData();
}

const run = async () => {
  await client.schedule.deleteMany({});
  await client.doctor.deleteMany({});
  await client.patient.deleteMany({});

  await client.patient.createMany({ data: patients, skipDuplicates: true });
  await client.doctor.createMany({ data: doctors, skipDuplicates: true });
  await client.schedule.createMany({
    data: appointments,
    skipDuplicates: true,
  });
  console.log("DB updated");
};
run();
