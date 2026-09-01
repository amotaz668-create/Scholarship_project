const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const User = require("../models/user");

dotenv.config();

const createEmployee = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);

    const employee = {
      name: "Full Test Employee",
      email: "employee.fulltest@gmail.com",
      password: "Employee123",
    };

    const existingUser = await User.findOne({
      email: employee.email,
    });

    if (existingUser) {
      existingUser.name = employee.name;
      existingUser.role = "employee";

      const hashedPassword = await bcrypt.hash(employee.password, 10);
      existingUser.password = hashedPassword;

      await existingUser.save();

      console.log(`${employee.email} updated as employee`);
    } else {
      const hashedPassword = await bcrypt.hash(employee.password, 10);

      await User.create({
        name: employee.name,
        email: employee.email,
        password: hashedPassword,
        role: "employee",
      });

      console.log(`${employee.email} created as employee`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createEmployee();