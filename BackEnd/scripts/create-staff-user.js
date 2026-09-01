require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const [role, email, password] = process.argv.slice(2);

if (!role || !email || !password || !["employee", "admin"].includes(role)) {
    console.error("Usage: node scripts/create-staff-user.js <employee|admin> <email> <password>");
    process.exit(1);
}

if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
}

async function main() {
    try {
        await mongoose.connect(process.env.MONGODBURL);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            { email: email.trim().toLowerCase() },
            { $set: { password: hashedPassword, role } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`Staff user ready: ${user.email} (${user.role})`);
    } catch (error) {
        console.error("Failed to create staff user:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

main();
