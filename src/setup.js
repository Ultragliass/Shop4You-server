db.users.insertMany([
  {
    email: "admin@admin.com",
    password: "$2b$10$TN1Hc9A9L3duVPAfgKFt2eHClXLjwz6k3kC.OVwYd1b.dSMSlBqUK",
    name: "Israel",
    lastname: "Israeli",
    id: "000000000",
    role: "admin",
  },
]);

// The password is a hash of '123456Ad', case sensitive, 10 rounds.
// DO NOT alter the 'role' field, all other fields are fine to alter to suit your admin.
