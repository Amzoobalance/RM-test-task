const registerPatient = async (req, res) => {
  if (
    !req.body.phone ||
    !req.body.name ||
    !req.body.email ||
    !req.body.gender
  ) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const patientExists = await getPatient(req);

  if (patientExists) {
    return res.status(409).json({ error: "Patient exists" });
  }

  const patientProfile = {
    phone: req.body.phone,
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
  };
  try {
    const newPatient = await req.db.patient.create({
      data: patientProfile,
    });
    res.json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatient = async (req) => {
  return req.db.patient.findMany({
    where: {
      OR: [
        { phone: { equals: req.body.phone } },
        { email: { equals: req.body.email } },
      ],
    },
  });
};

module.exports = {
  registerPatient,
};
