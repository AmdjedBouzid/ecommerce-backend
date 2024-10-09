import Admin from "@/app/models/Admin";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/mongodb";
import bcrypt from "bcryptjs";
import { regester } from "@/app/utils/validation";
import axios from "axios";
import Pin from "@/app/models/Pin";
import { generateRandomPin, Send_Email } from "@/app/utils/functions";
// import { connectDB } from "@/app/mongodb";
/**
 * @method POST
 * @route http://localhost:3000/api/auth/login-admin
 * @description Login admin and send email
 * @access public
 */
export async function POST(req) {
  try {
    await connectDB();

    // Parse the request body to get the admin data
    const { username, email, password, phonenumber } = await req.json();
    console.log("request:", { username, email, password, phonenumber });
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
    if (!existingAdmin) {
      return NextResponse.json(
        { error: "any admin regestred " },
        { status: 403 }
      );
    }
    const isUsernameValid = existingAdmin.username === username;
    const isEmailValid = existingAdmin.email === email;
    const isPhoneNumberValid = existingAdmin.phonenumber === phonenumber;
    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (
      !isUsernameValid ||
      !isEmailValid ||
      !isPhoneNumberValid ||
      !isPasswordValid
    ) {
      return NextResponse.json(
        { error: "Invalid login credentials." },
        { status: 403 }
      );
    }
    const pinCode = generateRandomPin();
    const emailResponse = await Send_Email(email, pinCode);
    if (emailResponse.success === true) {
      try {
        const PINS = await Pin.find({});
        if (PINS.length > 0) {
          await Pin.deleteMany({});
        }
        const newPin = new Pin({ code: pinCode });
        await newPin.save();
      } catch (error) {
        return NextResponse.json(
          { message: "error saving code pin ", error },
          { status: 404 }
        );
      }
      return NextResponse.json(emailResponse, { status: 200 });
    }

    return NextResponse.json(emailResponse, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}
