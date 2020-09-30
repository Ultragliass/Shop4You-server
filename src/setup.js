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

db.categories.insertMany([
  {
    _id: ObjectId("5f67217be2d0ac0978da425f"),
    name: "Dairy",
  },
  {
    _id: ObjectId("5f672185e2d0ac0978da4260"),
    name: "Meat and Poultry",
  },
  {
    _id: ObjectId("5f72cb170edc672938247b5d"),
    name: "Drinks",
  },
  {
    _id: ObjectId("5f72cb330edc672938247b5e"),
    name: "Fruit and vegetables",
  },
]);

db.items.insertMany([
  {
    name: "Goat Cheese",
    price: 30,
    URLPath:
      "https://www.thespruceeats.com/thmb/UnZpCP9FrnTqQhpnbCbezGidG0c=/1500x844/smart/filters:no_upscale()/Goat-Cheese-Culture1500-56a125c95f9b58b7d0bc791b.jpg",
    categoryId: "5f67217be2d0ac0978da425f",
  },
  {
    name: "White Cheese",
    price: 20,
    URLPath:
      "https://www.thespruceeats.com/thmb/UnZpCP9FrnTqQhpnbCbezGidG0c=/1500x844/smart/filters:no_upscale()/Goat-Cheese-Culture1500-56a125c95f9b58b7d0bc791b.jpg",
    categoryId: "5f67217be2d0ac0978da425f",
  },
  {
    name: "Blue Cheese",
    price: 50,
    URLPath:
      "https://www.thespruceeats.com/thmb/UnZpCP9FrnTqQhpnbCbezGidG0c=/1500x844/smart/filters:no_upscale()/Goat-Cheese-Culture1500-56a125c95f9b58b7d0bc791b.jpg",
    categoryId: "5f67217be2d0ac0978da425f",
  },
  {
    name: "Gauda Cheese",
    price: 25,
    URLPath:
      "https://www.thespruceeats.com/thmb/UnZpCP9FrnTqQhpnbCbezGidG0c=/1500x844/smart/filters:no_upscale()/Goat-Cheese-Culture1500-56a125c95f9b58b7d0bc791b.jpg",
    categoryId: "5f67217be2d0ac0978da425f",
  },

  {
    name: "Beef",
    price: 30,
    URLPath: "https://sharpmagazineme.com/uploads/2018/10/05102018195139.jpg",
    categoryId: "5f672185e2d0ac0978da4260",
  },
  {
    name: "Chicken",
    price: 30,
    URLPath: "https://sharpmagazineme.com/uploads/2018/10/05102018195139.jpg",
    categoryId: "5f672185e2d0ac0978da4260",
  },
  {
    name: "Lamb",
    price: 75,
    URLPath: "https://sharpmagazineme.com/uploads/2018/10/05102018195139.jpg",
    categoryId: "5f672185e2d0ac0978da4260",
  },
  {
    name: "Turkey",
    price: 45,
    URLPath: "https://sharpmagazineme.com/uploads/2018/10/05102018195139.jpg",
    categoryId: "5f672185e2d0ac0978da4260",
  },
  {
    name: "Cola",
    price: 8,
    URLPath:
      "https://images-na.ssl-images-amazon.com/images/I/71U%2B5KVElqL._AC_SL1500_.jpg",
    categoryId: "5f72cb170edc672938247b5d",
  },
  {
    name: "Sprite",
    price: 8,
    URLPath:
      "https://images-na.ssl-images-amazon.com/images/I/71U%2B5KVElqL._AC_SL1500_.jpg",
    categoryId: "5f72cb170edc672938247b5d",
  },
  {
    name: "Water",
    price: 3,
    URLPath:
      "https://images-na.ssl-images-amazon.com/images/I/71U%2B5KVElqL._AC_SL1500_.jpg",
    categoryId: "5f72cb170edc672938247b5d",
  },
  {
    name: "Soda",
    price: 5,
    URLPath:
      "https://images-na.ssl-images-amazon.com/images/I/71U%2B5KVElqL._AC_SL1500_.jpg",
    categoryId: "5f72cb170edc672938247b5d",
  },

  {
    name: "Tomato",
    price: 1,
    URLPath:
      "https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg",
    categoryId: "5f72cb330edc672938247b5e",
  },
  {
    name: "Potato",
    price: 1,
    URLPath:
      "https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg",
    categoryId: "5f72cb330edc672938247b5e",
  },
  {
    name: "Cucumber",
    price: 1,
    URLPath:
      "https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg",
    categoryId: "5f72cb330edc672938247b5e",
  },
  {
    name: "Pepper",
    price: 1,
    URLPath:
      "https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg",
    categoryId: "5f72cb330edc672938247b5e",
  },
]);

// The password is a hash of '123456Ad', case sensitive, 10 rounds.
// DO NOT alter the 'role' field, all other fields are fine to alter to suit your admin.
