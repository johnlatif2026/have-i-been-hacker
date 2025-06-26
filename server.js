const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

let emails = [];
const statusMap = {}; // لتخزين حالة كل بريد

app.use(express.json());
app.use(express.static(__dirname));

// استلام البريد من المستخدم
app.post('/submit-email', (req, res) => {
  const { email } = req.body;
  if (email && !emails.includes(email)) {
    emails.push(email);
    console.log("تم استلام بريد:", email);
  }
  res.sendStatus(200);
});

// عرض جميع الإيميلات للوحة التحكم
app.get('/emails', (req, res) => {
  res.json(emails);
});

// حذف بريد إلكتروني
app.post('/delete-email', (req, res) => {
  const { email } = req.body;
  emails = emails.filter(e => e !== email);
  delete statusMap[email]; // حذف الحالة أيضًا إن وجدت
  console.log("تم حذف البريد:", email);
  res.sendStatus(200);
});

// تعيين حالة بريد إلكتروني (آمن / مخترق)
app.post('/notify-status', (req, res) => {
  const { email, status } = req.body;
  if (email && (status === 'safe' || status === 'breached')) {
    statusMap[email] = status;
    console.log(`📢 تم تعيين حالة البريد ${email}: ${status}`);
    res.sendStatus(200);
  } else {
    res.status(400).send("بيانات غير صالحة");
  }
});

// استعلام عن حالة بريد
app.get('/check-status', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).send("لم يتم إرسال بريد");
  const status = statusMap[email] || null;
  res.json({ status });
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
