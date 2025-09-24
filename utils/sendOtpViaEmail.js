const nodemailer = require("nodemailer");

async function sendMail(email, otp) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hussainarshai972@gmail.com",
        pass: "epobdppxjvryzhvf"
      },
    });

    let mailOptions = {
      from: '"MY APP" <ilyasBaig012@gmail.com>',
      to: email,
      subject: "OTP Verification",
      text: otp,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = { sendMail };
