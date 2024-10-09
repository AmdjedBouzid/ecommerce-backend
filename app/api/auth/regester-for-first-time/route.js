import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/app/mongodb";
import bcrypt from "bcryptjs";
import { regester } from "@/app/utils/validation";
import axios from "axios";
import Admin from "@/app/models/Admin";
/**
 * @method POST
 * @route http://localhost:3000/api/auth/regester-for-first-time
 * @description register admin for first time
 * @access public
 */
export async function POST(req) {
  try {
    await connectDB();

    // Parse the request body to get the admin data
    const { username, email, password, phonenumber } = await req.json();
    const validation = regester.safeParse({
      username,
      email,
      password,
      phonenumber,
    });
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const response = await axios.get(
      `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.NEXT_PUBLIC_EMAIL_VEREFICATION_API_KEY}`
    );
    if (response.data.data.status === "invalid")
      return NextResponse.json(
        {
          message: "invalid email",
        },
        {
          status: 400,
        }
      );
    // Check if there is already an admin in the database
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists. Registration is closed." },
        { status: 403 }
      );
    }

    const SALT_NUMBER = parseInt(process.env.NEXT_PUBLIC_SALT_NUMBER, 10);
    console.log("SALT_NUMBER", SALT_NUMBER);

    const hashedPassword = await bcrypt.hash(password, SALT_NUMBER);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      phonenumber,
    });

    await newAdmin.save();
    return NextResponse.json(
      { message: "success to create admin ", newAdmin },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
