import Admin from "@/app/models/Admin";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/mongodb";
import bcrypt from "bcryptjs";
import { regester } from "@/app/utils/validation";
import axios from "axios";
import Pin from "@/app/models/Pin";
import { generateRandomPin, Send_Email } from "@/app/utils/functions";

/**
 * @method POST
 * @route http://localhost:3000/api/tese
 * @description Login admin and send email
 * @access public
 */
export async function POST(req) {
  await connectDB(); // Ensure connection to MongoDB
  //   const PINS = await Pin.find({}); // Fetch all PIN documents
  //   console.log("first", PINS[0].code);
  //   console.log("last", PINS[PINS.length - 1].code);
  //   return NextResponse.json(PINS); // Return the PIN documents as JSON response
  // }

  // const PINS = await Pin.find({});
  // if (PINS.length > 1 || PINS.length === 0) {
  //   await Pin.deleteMany({});
  //   return NextResponse.json({ message: "any code PIN sent  " }, { status: 500 });
}
