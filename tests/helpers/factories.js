/**
 * Test data factories.
 *
 * Each `buildX` returns a fresh plain object holding a VALID payload for the
 * corresponding resource — valid both against the Mongoose schema and against
 * the express-validator rules used on the create routes. Pass an overrides
 * object to tweak any field (including setting it to an invalid value to test
 * validation failures).
 *
 * These are intentionally framework-agnostic: the same object can be used as a
 * Supertest request body or passed straight to `Model.create()`.
 */
let counter = 0;
const uniq = () => `${Date.now()}-${(counter += 1)}`;

const buildUser = (o = {}) => ({
  name: "Test User",
  email: `user-${uniq()}@example.com`,
  password: "Passw0rd!",
  role: "user",
  ...o,
});

const buildProduct = (o = {}) => ({
  name: "Ankh Pendant",
  description: "Sterling silver pendant.",
  price: 350,
  stock: 20,
  imageUrl: "/assets/hero.svg",
  ...o,
});

const buildExhibit = (o = {}) => ({
  title: "Golden Mask of Tutankhamun",
  category: "Pharaoh",
  description: "A masterpiece of ancient gold craftsmanship and royal symbolism.",
  imageUrl: "/assets/hero.svg",
  modelUrl: "https://example.com/models/mask.glb",
  era: "New Kingdom",
  ...o,
});

const buildMapPin = (o = {}) => ({
  label: "Main Entrance",
  x: 20,
  y: 30,
  description: "Ticketing and security gate.",
  isCommon: false,
  ...o,
});

const buildTicket = (o = {}) => ({
  group: "egyptian",
  audience: "adult",
  price: 50,
  description: "Egyptian adult ticket",
  ...o,
});

const buildTestimonial = (o = {}) => ({
  name: "Laila",
  message: "A breathtaking journey through time.",
  rating: 5,
  ...o,
});

const buildNewsletter = (o = {}) => ({
  name: "News Subscriber",
  phone: "+201234567890",
  email: `subscriber-${uniq()}@example.com`,
  ...o,
});

const buildTicketRequest = (o = {}) => ({
  name: "Visitor One",
  age: 30,
  email: `visitor-${uniq()}@example.com`,
  nationality: "Egyptian",
  phone: "+201112223334",
  category: "egyptian",
  audience: "adult",
  quantity: 2,
  date: "2026-07-01",
  timeSlot: "10:00",
  ...o,
});

const buildAssistance = (o = {}) => ({
  name: "Assistance Seeker",
  email: `assist-${uniq()}@example.com`,
  phone: "12345",
  type: "wheelchair",
  date: "2026-07-01",
  notes: "Wheelchair needed at entrance.",
  ...o,
});

const buildCleaningZone = (o = {}) => ({
  zoneName: "Main Hall",
  description: "Ground floor central hall.",
  floor: "Ground",
  color: "#b7842a",
  polygon: [
    { x: 10, y: 10 },
    { x: 40, y: 10 },
    { x: 40, y: 40 },
    { x: 10, y: 40 },
  ],
  ...o,
});

const buildTask = (o = {}) => ({
  title: "Inspect Pharaoh gallery",
  description: "Routine condition inspection.",
  priority: "medium",
  ...o,
});

module.exports = {
  buildUser,
  buildProduct,
  buildExhibit,
  buildMapPin,
  buildTicket,
  buildTestimonial,
  buildNewsletter,
  buildTicketRequest,
  buildAssistance,
  buildCleaningZone,
  buildTask,
};
