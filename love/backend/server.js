const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");

const User = require("./models/user.model");
const Message = require("./models/message.model");

dotenv.config();
const app = express();
app.use(cors());
// app.use(express.static(public));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

const key = Buffer.from(process.env.KEY, "hex");

// Encrypt/decrypt logic
const encryptMessage = (msg, key) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(msg, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    cipherText: encrypted,
  };
};

const decryptMessage = (payload, key) => {
  const iv = Buffer.from(payload.iv, "hex");
  const authTag = Buffer.from(payload.authTag, "hex");
  const encryptedText = payload.cipherText;
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Auth Middleware
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).send("Invalid Token");
  }
};

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Routes

app.get("/healthcheck", (req, res) => {
  res.json({ status: "healthy", time: new Date() });
});

app.post("/signup", async (req, res) => {
  const { email, password, partnerEmail } = req.body;
  try {
    const user = await User.create({ email, password, partnerEmail });
    res.status(201).send({
      message: "User created 🎉",
      user,
    });
  } catch (e) {
    res.status(400).send("Signup failed: " + e.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).send("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.json({ token });
});

app.post("/send", auth, async (req, res) => {
  const { content: message } = req.body;
  const encrypted = encryptMessage(message, key);

  const newMessage = await Message.create({
    from: req.user.email,
    to: req.user.partnerEmail,
    ...encrypted,
  });

  res.status(201).json({ message: "Message sent", id: newMessage._id });
});

app.get("/inbox", auth, async (req, res) => {
  const messages = await Message.find({ to: req.user.email }).sort(
    "-createdAt"
  );
  res.json(messages);
});

app.post("/decrypt", auth, (req, res) => {
  try {
    const decrypted = decryptMessage(req.body, key);
    res.json({ message: decrypted });
  } catch (e) {
    res.status(400).send("Decryption failed");
  }
});

app.get("/me", auth, (req, res) => {
  if (!req.user) return res.status(404).send("User not found");
  const { _id, email, partnerEmail } = req.user;
  res.json({ id: _id, email, partnerEmail });
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 This Server running on port ${PORT} 💥`)
);
