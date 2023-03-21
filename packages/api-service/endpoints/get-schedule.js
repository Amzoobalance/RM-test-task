const getSchedule = async (req, res) => {
  const query = {
    date: req.params.date,
  };

  const { date_from, date_to, is_free, doctor_id, patient_id } = req.query;

  if (date_from) {
    query.date_from = { gte: new Date(date_from) };
  }
  if (date_to) {
    query.date_to = { lte: new Date(date_to) };
  }
  if (is_free) {
    query.is_free = is_free;
  }
  if (patient_id) {
    query.patient_id = patient_id;
  }
  if (doctor_id) {
    query.doctor_id = doctor_id;
  }

  const schedule = await req.db.schedule.findMany({ where: query });
  res.json(schedule);
};

module.exports = {
  getSchedule,
};
