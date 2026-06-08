const TicketRequest = require("../models/TicketRequest");
const Task = require("../models/Task");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const requests = await TicketRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});

const summary = asyncHandler(async (req, res) => {
  const [count, latest] = await Promise.all([
    TicketRequest.countDocuments(),
    TicketRequest.findOne().sort({ createdAt: -1 })
  ]);

  res.json({
    count,
    latest: latest
      ? {
        _id: latest._id,
        name: latest.name,
        date: latest.date,
        createdAt: latest.createdAt
      }
      : null
  });
});

const create = asyncHandler(async (req, res) => {
  const { name, age, email, nationality, phone, category, audience, quantity, date, timeSlot } = req.body;
  const request = await TicketRequest.create({
    name,
    age,
    email,
    nationality,
    phone,
    category,
    audience,
    quantity,
    date,
    timeSlot,
    user: req.session.user ? req.session.user.id : null
  });
  res.status(201).json(request);
});

const convertToTask = asyncHandler(async (req, res) => {
  const request = await TicketRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: "Ticket request not found" });
  }

  const task = await Task.create({
    title: `Ticket Request Follow-up: ${request.name}`,
    description: `Handle ticket request for ${request.name} (${request.email}, ${request.phone}) on ${request.date} at ${request.timeSlot}.`,
    priority: req.body.priority || "medium",
    status: "assigned",
    dueAt: req.body.dueAt || null,
    assignedBy: req.session.user.id,
    assignedTo: req.body.assignedTo,
    roleTarget: req.body.roleTarget || "front_desk",
    checklist: [
      "Contact visitor to confirm request details",
      "Validate ticket category and audience",
      "Finalize booking status"
    ]
  });

  request.status = "processing";
  await request.save();

  return res.status(201).json({ task, message: "Ticket request converted to task" });
});

const updateStatus = asyncHandler(async (req, res) => {
  const allowed = ["pending", "accepted", "rejected", "processing"];
  const { status } = req.body;
  if (!allowed.includes(status)) {
    return res.status(422).json({ message: "Invalid status" });
  }
  const request = await TicketRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!request) {
    return res.status(404).json({ message: "Ticket request not found" });
  }
  res.json(request);
});

module.exports = { list, summary, create, convertToTask, updateStatus };