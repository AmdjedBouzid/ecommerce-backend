import { NextFetchEvent, NextResponse } from "next/server";
import { connectDB } from "@/app/mongodb";
import Pin from "@/app/models/Pin";
import Admin from "@/app/models/Admin";
import jwt from "jsonwebtoken";
/**
 * @method POST
 * @route http://localhost:3000/api/auth/pin-verefication-login
 * @description verify user by code pin
 * @access public
 */
export async function POST(req) {
  try {
    await connectDB();
    const { Code_Pink } = await req.json();
    const PINS = await Pin.find({});
    if (PINS.length > 1) {
      await Pin.deleteMany({});
      return NextResponse.json(
        { message: "many code PIN stored " },
        { status: 500 }
      );
    }

    if (PINS.length === 0) {
      return NextResponse.json(
        { message: "any code PIN stored " },
        { status: 500 }
      );
    }
    const date1 = new Date(PINS[0].createdAt);
    const date2 = new Date();
    console.log("date1", date1);
    console.log("date2", date2);
    const diffInMilliseconds = date2.getTime() - date1.getTime();

    const diffInSeconds = diffInMilliseconds / 1000;
    console.log(`Difference in seconds: ${diffInSeconds}`);
    if (diffInSeconds > 1000) {
      await Pin.deleteMany({});
      return NextResponse.json(
        { message: "tohen has expered " },
        { status: 404 }
      );
    }

    if (Code_Pink === PINS[0].code) {
      const admin = await Admin.findOne({});

      if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 });
      }

      const token = jwt.sign(admin, process.env.NEXT_PUBLIC_JWT_SECRET, {
        expiresIn: "30d",
      });

      const userWithoutPassword = {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        phonenumber: admin.phonenumber,
        profileImg: admin.profileImg,
      };

      return NextResponse.json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      });
    } else {
      return NextResponse.json(
        { message: "in correct code PIN " },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("error : ", error);
    return NextResponse.json(
      { message: "internel server error" },
      { status: 500 }
    );
  }
}
