const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const User = require("../models/user");

dotenv.config();

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);

    const admins = [
      {
        name: "Amotaz",
        email: "amotaz668@gmail.com",
        password: "amotaz668",
      },
      {
        name: "Admin 2",
        email: "admin2@gmail.com",
        password: "Admin123",
      },
      {
        name: "Admin 3",
        email: "admin3@gmail.com",
        password: "Admin123",
      },
    ];

    for (const admin of admins) {
      const existingUser = await User.findOne({
        email: admin.email,
      });

      const hashedPassword = await bcrypt.hash(admin.password, 10);

      if (existingUser) {
        existingUser.name = admin.name;
        existingUser.password = hashedPassword;
        existingUser.role = "admin";

        await existingUser.save();

        console.log(`${admin.email} updated as admin`);
        continue;
      }

      await User.create({
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: "admin",
      });

      console.log(`${admin.email} created as admin`);
    }

    console.log("3 Admins are ready");

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmins();

