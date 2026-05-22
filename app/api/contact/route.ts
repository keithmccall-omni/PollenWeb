import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      company,
      message,
    } = body;

    if (
      !name ||
      !email ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const transporter =
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,

        port: Number(
          process.env.SMTP_PORT
        ),

        secure: false,

        auth: {
          user: process.env.SMTP_USER,

          pass: process.env.SMTP_PASSWORD,
        },
      });

    await transporter.sendMail({
      from: `Pollen Website <${process.env.SMTP_USER}>`,

      to: "ops@pollensystems.com",

      replyTo: email,

      subject: `Pollen Systems Contact Form - ${name}`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #111;
          "
        >
          <h2>
            New Contact Form Submission
          </h2>

          <p>
            <strong>Name:</strong>
            <br />
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            <br />
            ${email}
          </p>

          <p>
            <strong>Company:</strong>
            <br />
            ${company || "N/A"}
          </p>

          <p>
            <strong>Message:</strong>
            <br />
            ${message.replace(
              /\n/g,
              "<br />"
            )}
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to send email",
      },
      {
        status: 500,
      }
    );
  }
}