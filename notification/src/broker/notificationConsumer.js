import { subscribeToQueue } from "./rabbit.js";
import sendEmail from "../utils/email.js";

export const initNotificationConsumer = () => {
  // ✅ USER CREATED
  subscribeToQueue("user_created", async (data) => {
    const { email, firstName, lastName } = data;

    const template = `
<!doctype html>
<html>
<head>
  <style>
    body { font-family: Arial; background:#f4f6f8; }
    .container { max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; }
    .header { background:#4f46e5; color:white; padding:25px; text-align:center; }
    .content { padding:25px; color:#333; }
    .btn { display:inline-block; padding:12px 20px; background:#4f46e5; color:white; text-decoration:none; border-radius:5px; margin-top:15px; }
    .footer { text-align:center; font-size:12px; color:#888; padding:15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to NeuroBank 🎉</h1>
    </div>
    <div class="content">
      <p>Hello <b>${firstName} ${lastName}</b>,</p>
      <p>Your account has been successfully created.</p>
      <p>Now you can manage your money, send payments, and track transactions easily.</p>
      <a class="btn">Get Started</a>
    </div>
    <div class="footer">
      © 2026 NeuroBank. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

    await sendEmail(email, "Welcome to NeuroBank", "", template);
  });

  // ✅ ACCOUNT CREATED
  subscribeToQueue("account_created", async (data) => {
    const {
      email,
      ownerName,
      accountNumber,
      accountType,
      balance,
      currency,
      status,
    } = data;

    const template = `
<!doctype html>
<html>
<head>
  <style>
    body { font-family: Arial; background:#f4f6f8; }
    .container { max-width:600px; margin:auto; background:#fff; border-radius:10px; }
    .header { background:#0ea5e9; color:white; padding:20px; text-align:center; }
    .content { padding:25px; }
    .box { background:#f1f5f9; padding:15px; border-radius:6px; }
    .footer { text-align:center; font-size:12px; color:#888; padding:15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Account Created 🏦</h1>
    </div>
    <div class="content">
      <p>Hello <b>${ownerName}</b>,</p>
      <p>Your bank account has been successfully created.</p>

      <div class="box">
        <p><b>Account Number:</b> ${accountNumber}</p>
        <p><b>Account Type:</b> ${accountType}</p>
        <p><b>Balance:</b> ${balance} ${currency}</p>
        <p><b>Status:</b> ${status}</p>
      </div>

      <p>You can now start using your account.</p>
    </div>
    <div class="footer">
      © 2026 NeuroBank
    </div>
  </div>
</body>
</html>
`;
  });

  // ✅ USER CREDITED
  subscribeToQueue("user_credited", async (data) => {
    const { email, firstName, amount, fromAccount, dateTime, transactionId } =
      data;

    const template = `
<!doctype html>
<html>
<head>
  <style>
    body { font-family: Arial; background:#f4f6f8; }
    .container { max-width:600px; margin:auto; background:#fff; border-radius:10px; }
    .header { background:#22c55e; color:white; padding:20px; text-align:center; }
    .content { padding:25px; }
    .box { background:#ecfdf5; padding:15px; border-radius:6px; }
    .footer { text-align:center; font-size:12px; color:#888; padding:15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Amount Credited 💰</h1>
    </div>
    <div class="content">
      <p>Hello <b>${firstName}</b>,</p>
      <p>Your account has been credited successfully.</p>

      <div class="box">
        <p><b>Amount:</b> ${amount}</p>
        <p><b>From:</b> ${fromAccount}</p>
        <p><b>Date:</b> ${dateTime}</p>
        <p><b>Transaction ID:</b> ${transactionId}</p>
      </div>

      <p>Thank you for banking with us.</p>
    </div>
    <div class="footer">
      © 2026 NeuroBank
    </div>
  </div>
</body>
</html>
`;

    await sendEmail(email, "Amount Credited", "", template);
  });

  // ✅ USER DEBITED
  subscribeToQueue("user_debited", async (data) => {
    const { email, firstName, amount, toAccount, dateTime, transactionId } =
      data;

    const template = `
<!doctype html>
<html>
<head>
  <style>
    body { font-family: Arial; background:#f4f6f8; }
    .container { max-width:600px; margin:auto; background:#fff; border-radius:10px; }
    .header { background:#ef4444; color:white; padding:20px; text-align:center; }
    .content { padding:25px; }
    .box { background:#fef2f2; padding:15px; border-radius:6px; }
    .footer { text-align:center; font-size:12px; color:#888; padding:15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Amount Debited ⚠️</h1>
    </div>
    <div class="content">
      <p>Hello <b>${firstName}</b>,</p>
      <p>Your account has been debited.</p>

      <div class="box">
        <p><b>Amount:</b> ${amount}</p>
        <p><b>To:</b> ${toAccount}</p>
        <p><b>Date:</b> ${dateTime}</p>
        <p><b>Transaction ID:</b> ${transactionId}</p>
      </div>

      <p>If this was not you, contact support immediately.</p>
    </div>
    <div class="footer">
      © 2026 NeuroBank
    </div>
  </div>
</body>
</html>
`;

    await sendEmail(email, "Amount Debited", "", template);
  });
};

export default initNotificationConsumer;
