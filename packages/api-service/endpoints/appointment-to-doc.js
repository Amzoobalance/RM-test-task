const appointmentToDoc = async (req, res) => {
  const query = {
    date: req.body.date,
    time_from: req.body.time_from,
    time_to: req.body.time_to,
    doctor_id: req.body.doctor_id,
    patient_id: req.body.patient_id,
  };
  const appointmentExists = await req.db.schedule.findMany({
    where: {
      AND: [
        {
          date: {
            equals: req.body.date,
          },
          time_from: {
            equals: req.body.time_from,
          },
          time_to: {
            equals: req.body.time_to,
          },
          doctor_id: {
            equals: req.body.doctor_id,
          },
          patient_id: {
            equals: req.body.patient_id,
          },
        },
      ],
    },
  });

  if (
    appointmentExists.length > 0
      ? appointmentExists[0]
      : appointmentExists === 0
  ) {
    return res.status(409).json({ error: "Slot is busy" });
  }

  if (req.body.date < new Date()) {
    return res.status(409).json({ error: "Invalid time" });
  }

  query.is_free = false;
  query.type = req.body.type ?? 0;
  query.fakeData = false;

  const appointment = await req.db.schedule.create({ data: query });

  res.json(appointment);
};

module.exports = {
  appointmentToDoc,
};
