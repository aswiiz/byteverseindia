import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const MONGODB_URI = process.env.MONGODB_URI || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aswinraj@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ByteVerse@2026!';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// Connection caching for serverless
let isConnected = false;
async function connectToDatabase() {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI, { bufferCommands: false });
      isConnected = true;
    } catch (err) {
      console.error('MongoDB Atlas serverless connection error:', err);
    }
  }
}

// Schemas
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  technologies: [{ type: String }],
  features: [{ type: String }],
  mainImage: { type: String, required: true },
  screenshots: [{ type: String }],
  githubUrl: { type: String },
  demoUrl: { type: String },
  status: { type: String, default: 'Production' },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const enquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  projectType: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
  telegramDelivered: { type: Boolean, default: false },
  telegramError: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

// Vercel Serverless Handler
export default async function handler(req, res) {
  await connectToDatabase();
  
  // Forward to express or route directly
  if (req.method === 'GET' && req.url === '/api/health') {
    return res.status(200).json({ status: 'ok', service: 'ByteVerse Serverless API' });
  }

  // Handle projects list
  if (req.method === 'GET' && req.url?.startsWith('/api/projects')) {
    if (isConnected) {
      const projects = await Project.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ success: true, data: projects });
    }
    return res.status(200).json({ success: true, data: [] });
  }

  // Handle enquiry
  if (req.method === 'POST' && req.url === '/api/enquiries') {
    const { fullName, email, phone, projectType, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }

    let telegramSent = false;
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const text = `<b>ByteVerse - New Project Enquiry</b>\n\n<b>Name:</b> ${fullName}\n<b>Email:</b> ${email}\n<b>Phone:</b> ${phone || 'N/A'}\n<b>Project:</b> ${projectType}\n\n<b>Message:</b>\n${message}`;
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' })
        });
        const tgData = await tgRes.json();
        telegramSent = tgData.ok;
      } catch (e) {
        console.error('Telegram error:', e);
      }
    }

    if (isConnected) {
      const enq = new Enquiry({
        fullName,
        email,
        phone,
        projectType,
        message,
        telegramDelivered: telegramSent
      });
      await enq.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Enquiry received successfully!',
      telegramDelivered: telegramSent
    });
  }

  return res.status(200).json({ message: 'ByteVerse Vercel Serverless Entrypoint' });
}
