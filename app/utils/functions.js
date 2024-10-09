import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
export const Send_Email = async (email, Code_Pin) => {
  const Email = process.env.NEXT_PUBLIC_EMAIL_SENDER;
  const PASSWOR = process.env.NEXT_PUBLIC_EMAIL_SENDER_PASSWORD;
  // console.log(Email, PASSWOR);
  // await connectDB();
  // Set up the transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: Email, // Your email address
      pass: PASSWOR, // Your email password
    },
    debug: true, // Enable SMTP debugging
    logger: true, // Log information
  });

  // Email options
  // const email = "rahmaladjabi933@gmail.com";
  const mailOptions = {
    from: Email,
    to: email,
    subject: `Admin Login PIN Code ${Code_Pin}`,
    text: `Your PIN code for admin login is: ${Code_Pin}`, // This is the PIN, customize as needed
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      //  console.log("Email sent: " + info.response);
      return {
        Pin: Code_Pin,
        success: true,
        message: "Email sent successfully",
        info: info.response,
      };
    } else {
      console.log("Email not accepted: " + info.response);
      return {
        success: false,
        message: "Email not accepted",
        info: info.response,
      };
    }
  } catch (error) {
    console.log("error", error);
    return { error: error };
  }
};

export function generateRandomPin() {
  const pin = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
  return pin;
}
// import jwt from "jsonwebtoken";
// import Pin from "../models/Pin";
// import { serialize } from "cookie";
// import { SECRET_KEY } from "./constants";
// import cookie from "cookie";
// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";
// export const Generate_Token = (user) => {
//   const Token = jwt.sign(user, process.env.NEXT_PUBLIC_JWT_SECRET);
//   const cookie = serialize("Token", Token, {
//     httpOnly: false,
//     secure: false, //process.env.NEXT_PUBLIC_NODE_ENV === "production", // Use secure cookies in production
//     maxAge: 60 * 60 * 24 * 30, // 1 month
//     sameSite: "strict",
//     path: "/",
//   });
//   return cookie;
// };

// export async function Get_User(req) {
//   const url = req.nextUrl;
//   const pathname = url.pathname;
//   if (
//     !req ||
//     (!req.headers && (pathname !== "/Regester" || pathname !== "/Login"))
//   ) {
//     console.error("Request or headers not found");
//     throw new Error("Request or headers not found");
//   }
//   try {
//     // Extract cookies from the request
//     const cookies = cookie.parse(req.headers.get("cookie") || "");

//     const token = cookies.Token;

//     if (
//       !token &&
//       (pathname !== "/Regester" ||
//         pathname !== "/Login" ||
//         pathname !== "/api/users/logout")
//     ) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 400 });
//     }
//     // console.log("token------------", token);
//     // Verify the JWT
//     const { payload: decodedUser } = await jwtVerify(token, SECRET_KEY);

//     // console.log("Token:", token);
//     // console.log("Decoded User:", decodedUser);

//     return { user: decodedUser };
//   } catch (error) {
//     console.error("Error:", error.message);
//     return NextResponse.json(
//       { message: "Error verifying token" },
//       { status: 401 }
//     );
//   }
// }
