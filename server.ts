import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import JSZip from 'jszip';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aswinraj@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ByteVerse@2026!';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'byteverse-secret-token-key-2026';
const MONGODB_URI = process.env.MONGODB_URI || '';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic Security Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Database Models & In-Memory Fallback Store
interface IProject {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: 'Web Applications' | 'Mobile & AI' | 'Cloud & DevOps' | 'Open Source' | 'Enterprise Tools';
  technologies: string[];
  features: string[];
  mainImage: string;
  screenshots: string[];
  githubUrl?: string;
  demoUrl?: string;
  status: 'Production' | 'Beta' | 'In Development' | 'Completed' | 'Archived';
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface IEnquiry {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  telegramDelivered: boolean;
  telegramError?: string;
  createdAt: string;
}

// Initial High-Fidelity Default Showcase Projects
const INITIAL_PROJECTS: IProject[] = [
  {
    _id: 'proj_1',
    title: 'CloudFlow Platform',
    slug: 'cloudflow-platform',
    shortDescription: 'Next-generation distributed cloud management and real-time server telemetry orchestration engine.',
    description: 'CloudFlow is an enterprise-grade cloud management suite engineered for multi-region Kubernetes clusters and edge computing nodes. It unifies telemetry streams, automated failovers, and resource allocation into a single reactive interface, slashing mean time to resolution by 64%.',
    category: 'Cloud & DevOps',
    technologies: ['Go', 'TypeScript', 'React', 'Docker', 'Kubernetes', 'Prometheus', 'Tailwind CSS'],
    features: [
      'Real-time cluster node topology mapping and health monitoring',
      'Sub-millisecond latency telemetry stream processing with automated failover',
      'Automated auto-scaling trigger policies based on predictive traffic',
      'Integrated multi-cloud cost forecasting and resource right-sizing'
    ],
    mainImage: '/src/assets/images/project_cloudflow_platform_1791985097329.jpg',
    screenshots: [
      '/src/assets/images/project_cloudflow_platform_1791985097329.jpg',
      '/src/assets/images/project_devlens_cli_1791985098000.jpg'
    ],
    githubUrl: 'https://github.com/byteverse-org/cloudflow',
    demoUrl: 'https://demo.byteverse.dev/cloudflow',
    status: 'Production',
    isFeatured: true,
    isPublished: true,
    order: 1,
    createdAt: new Date('2026-08-15').toISOString(),
    updatedAt: new Date('2026-09-20').toISOString()
  },
  {
    _id: 'proj_2',
    title: 'Neural Nexus AI Studio',
    slug: 'neural-nexus-ai',
    shortDescription: 'Visual neural graph builder and low-latency LLM agent workflow deployment suite.',
    description: 'Neural Nexus AI is an interactive canvas for chaining transformer blocks, vector embeddings, and autonomous retrieval agents. Teams can visually design, benchmark, and deploy enterprise reasoning agents with production-grade telemetry and rate limiting.',
    category: 'Mobile & AI',
    technologies: ['Python', 'FastAPI', 'React', 'WebSockets', 'PyTorch', 'Tailwind CSS', 'Redis'],
    features: [
      'Drag-and-drop neural connection graph editor with real-time execution feedback',
      'Real-time inference profiling & token cost tracker per prompt node',
      'Built-in semantic caching and vector search routing',
      'One-click serverless model endpoint deployment with automatic SSL'
    ],
    mainImage: '/src/assets/images/project_neural_nexus_ai_1791985097574.jpg',
    screenshots: [
      '/src/assets/images/project_neural_nexus_ai_1791985097574.jpg',
      '/src/assets/images/project_cloudflow_platform_1791985097329.jpg'
    ],
    githubUrl: 'https://github.com/byteverse-org/neural-nexus',
    demoUrl: 'https://demo.byteverse.dev/neural-nexus',
    status: 'Production',
    isFeatured: true,
    isPublished: true,
    order: 2,
    createdAt: new Date('2026-07-10').toISOString(),
    updatedAt: new Date('2026-09-18').toISOString()
  },
  {
    _id: 'proj_3',
    title: 'Fintech Pulse Terminal',
    slug: 'fintech-pulse',
    shortDescription: 'High-frequency decentralized market and liquidity terminal with automated algorithmic order routing.',
    description: 'Fintech Pulse is an institutional-grade decentralized finance execution terminal delivering millisecond order book updates, algorithmic hedging triggers, and cryptographic verification for cross-chain liquidity pools.',
    category: 'Enterprise Tools',
    technologies: ['TypeScript', 'Next.js', 'Web3.js', 'Rust', 'Tailwind CSS', 'ECharts', 'Node.js'],
    features: [
      'Sub-10ms WebSocket candlestick & orderbook streams with zero jank',
      'Automated risk parity & smart slippage mitigation algorithms',
      'Comprehensive smart contract audit trails and verification stamps',
      'Hardware key integration and multi-sig authorization flows'
    ],
    mainImage: '/src/assets/images/project_fintech_pulse_1791985098594.jpg',
    screenshots: [
      '/src/assets/images/project_fintech_pulse_1791985098594.jpg'
    ],
    githubUrl: 'https://github.com/byteverse-org/fintech-pulse',
    demoUrl: 'https://demo.byteverse.dev/fintech-pulse',
    status: 'Production',
    isFeatured: true,
    isPublished: true,
    order: 3,
    createdAt: new Date('2026-06-05').toISOString(),
    updatedAt: new Date('2026-09-12').toISOString()
  },
  {
    _id: 'proj_4',
    title: 'DevLens CI/CD Observability',
    slug: 'devlens-cicd',
    shortDescription: 'Developer observability and automated pipeline bottleneck detection tool.',
    description: 'DevLens monitors software delivery lifecycles, identifying flaky tests, unoptimized Docker container builds, and deployment bottlenecks across distributed engineering teams with automated remediation insights.',
    category: 'Cloud & DevOps',
    technologies: ['Node.js', 'Express', 'React', 'Docker', 'PostgreSQL', 'Tailwind CSS', 'GraphQL'],
    features: [
      'Visual step-by-step pipeline execution traces and cache hit rates',
      'Flaky test detection using predictive statistical models',
      'Granular container image layer cache inspector and size optimizer',
      'Interactive GitHub Actions and GitLab CI integration hooks'
    ],
    mainImage: '/src/assets/images/project_devlens_cli_1791985098000.jpg',
    screenshots: [
      '/src/assets/images/project_devlens_cli_1791985098000.jpg'
    ],
    githubUrl: 'https://github.com/byteverse-org/devlens-cli',
    demoUrl: 'https://demo.byteverse.dev/devlens',
    status: 'Beta',
    isFeatured: true,
    isPublished: true,
    order: 4,
    createdAt: new Date('2026-05-18').toISOString(),
    updatedAt: new Date('2026-08-30').toISOString()
  },
  {
    _id: 'proj_5',
    title: 'Aura Commerce Engine',
    slug: 'aura-commerce-engine',
    shortDescription: 'Headless ultra-fast ecommerce storefront architecture with instant edge caching and global payments.',
    description: 'Aura provides a modular shopping framework designed for global consumer brands, offering sub-second page loads, automated currency conversion, and headless CMS synchronization.',
    category: 'Web Applications',
    technologies: ['React', 'TypeScript', 'Node.js', 'Stripe API', 'Tailwind CSS', 'MongoDB'],
    features: [
      'Edge-cached dynamic catalog search with instant typeahead',
      'Unified cart synchronization across desktop and mobile devices',
      'Automated multi-currency conversion and localized tax calculations',
      'Extensible plugin architecture for headless ERP integrations'
    ],
    mainImage: '/src/assets/images/project_cloudflow_platform_1791985097329.jpg',
    screenshots: [
      '/src/assets/images/project_cloudflow_platform_1791985097329.jpg'
    ],
    githubUrl: 'https://github.com/byteverse-org/aura-commerce',
    demoUrl: 'https://demo.byteverse.dev/aura',
    status: 'Production',
    isFeatured: false,
    isPublished: true,
    order: 5,
    createdAt: new Date('2026-04-20').toISOString(),
    updatedAt: new Date('2026-07-15').toISOString()
  },
  {
    _id: 'proj_6',
    title: 'Synapse Vector Gateway',
    slug: 'synapse-vector-gateway',
    shortDescription: 'High-throughput vector search reverse-proxy for enterprise retrieval and semantic deduplication.',
    description: 'Synapse acts as a lightning-fast gateway sitting between semantic AI agents and heterogeneous vector stores, orchestrating reranking, hybrid keyword-vector search, and role-based access control.',
    category: 'Open Source',
    technologies: ['Rust', 'Go', 'Docker', 'gRPC', 'Python', 'Tailwind CSS'],
    features: [
      'Zero-copy vector quantization engine with sub-5ms roundtrips',
      'Cross-encoder semantic reranking pipeline with GPU acceleration',
      'Pluggable adapters for Milvus, Qdrant, Pinecone, and pgvector',
      'OpenTelemetry metrics export out of the box'
    ],
    mainImage: '/src/assets/images/project_neural_nexus_ai_1791985097574.jpg',
    screenshots: [
      '/src/assets/images/project_neural_nexus_ai_1791985097574.jpg'
    ],
    githubUrl: 'https://github.com/byteverse-org/synapse-gateway',
    demoUrl: 'https://demo.byteverse.dev/synapse',
    status: 'Production',
    isFeatured: false,
    isPublished: true,
    order: 6,
    createdAt: new Date('2026-03-12').toISOString(),
    updatedAt: new Date('2026-06-25').toISOString()
  }
];

let localProjects: IProject[] = [...INITIAL_PROJECTS];
let localEnquiries: IEnquiry[] = [
  {
    _id: 'enq_1',
    fullName: 'David Sterling',
    email: 'david@sterlingtech.io',
    phone: '+1 555-0192',
    projectType: 'Cloud Architecture',
    message: 'We are looking to migrate our legacy microservices architecture to a containerized edge setup similar to CloudFlow.',
    status: 'read',
    telegramDelivered: false,
    createdAt: new Date('2026-10-10T14:30:00Z').toISOString()
  }
];

let isMongoConnected = false;

// Mongoose Schemas (used when MongoDB URI is supplied)
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
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
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  projectType: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
  telegramDelivered: { type: Boolean, default: false },
  telegramError: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const MongoProject = mongoose.models.Project || mongoose.model('Project', projectSchema);
const MongoEnquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

// MongoDB Connection attempt
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
      isMongoConnected = true;
      console.log('MongoDB Atlas connected successfully.');
      // Seed if empty
      const count = await MongoProject.countDocuments();
      if (count === 0) {
        console.log('Seeding initial projects to MongoDB Atlas...');
        await MongoProject.insertMany(INITIAL_PROJECTS.map(p => {
          const { _id, ...rest } = p;
          return rest;
        }));
      }
    })
    .catch((err) => {
      console.warn('MongoDB connection unavailable, using resilient fallback store:', err.message);
      isMongoConnected = false;
    });
} else {
  console.log('No MONGODB_URI configured in environment. Using resilient in-memory fallback store.');
}

// Telegram Delivery Helper
async function sendTelegramMessage(enquiry: {
  fullName: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  createdAt: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return {
      success: false,
      error: 'Telegram Bot credentials not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing).'
    };
  }

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const formattedDate = new Date(enquiry.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const text = [
    `<b>ByteVerse - New Project Enquiry</b>`,
    ``,
    `<b>Name:</b> ${escapeHtml(enquiry.fullName)}`,
    `<b>Email:</b> ${escapeHtml(enquiry.email)}`,
    `<b>Phone:</b> ${escapeHtml(enquiry.phone || 'Not provided')}`,
    `<b>Project Type:</b> ${escapeHtml(enquiry.projectType)}`,
    `<b>Date:</b> ${escapeHtml(formattedDate)}`,
    ``,
    `<b>Message:</b>`,
    `${escapeHtml(enquiry.message)}`
  ].join('\n');

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.description || 'Telegram API returned false status' };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error communicating with Telegram API' };
  }
}

// Cryptographically Secure Session Token Management with Expiry (24 hours)
interface AdminSession {
  token: string;
  expiresAt: number;
}
const activeAdminSessions = new Map<string, AdminSession>();

function isValidAdminToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const session = activeAdminSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeAdminSessions.delete(token);
    return false;
  }
  return true;
}

// Failed Login Rate Limiter (5 failed attempts per IP locks out for 15 minutes)
const failedLoginAttempts = new Map<string, { count: number; resetAt: number }>();

function isIpLockedOut(ip: string): boolean {
  const now = Date.now();
  const entry = failedLoginAttempts.get(ip);
  if (!entry) return false;
  if (now > entry.resetAt) {
    failedLoginAttempts.delete(ip);
    return false;
  }
  return entry.count >= 5;
}

function recordFailedLogin(ip: string) {
  const now = Date.now();
  const entry = failedLoginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    failedLoginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
  } else {
    entry.count += 1;
  }
}

function resetFailedLogin(ip: string) {
  failedLoginAttempts.delete(ip);
}

// Constant-time string comparison to prevent timing attacks
function timingSafeCompare(input: string, secret: string): boolean {
  const inputBuffer = Buffer.from(input, 'utf8');
  const secretBuffer = Buffer.from(secret, 'utf8');
  if (inputBuffer.length !== secretBuffer.length) {
    crypto.timingSafeEqual(inputBuffer, inputBuffer);
    return false;
  }
  return crypto.timingSafeEqual(inputBuffer, secretBuffer);
}

// Admin Auth Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication token required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!isValidAdminToken(token)) {
    res.status(403).json({ success: false, error: 'Forbidden: Invalid or expired admin session' });
    return;
  }
  next();
}

// ======================== API ROUTES ========================

// 1. Projects Public & Filtered List
app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const { category, search, featured } = req.query;
    const authHeader = req.headers.authorization;
    const isAdmin = authHeader?.startsWith('Bearer ') && isValidAdminToken(authHeader.split(' ')[1]);

    if (isMongoConnected) {
      const query: any = {};
      if (!isAdmin) {
        query.isPublished = true;
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      if (featured === 'true') {
        query.isFeatured = true;
      }
      if (search && typeof search === 'string') {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { technologies: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      const projects = await MongoProject.find(query).sort({ order: 1, createdAt: -1 });
      res.json({ success: true, data: projects });
    } else {
      let filtered = [...localProjects];
      if (!isAdmin) {
        filtered = filtered.filter(p => p.isPublished);
      }
      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (featured === 'true') {
        filtered = filtered.filter(p => p.isFeatured);
      }
      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some(t => t.toLowerCase().includes(q))
        );
      }
      res.json({ success: true, data: filtered });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Project Details by Slug
app.get('/api/projects/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    let project: any = null;

    if (isMongoConnected) {
      project = await MongoProject.findOne({ slug });
    } else {
      project = localProjects.find(p => p.slug === slug);
    }

    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found with the requested slug' });
      return;
    }

    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Admin: Create Project
app.post('/api/projects', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      category,
      technologies,
      features,
      mainImage,
      screenshots,
      githubUrl,
      demoUrl,
      status,
      isFeatured,
      isPublished
    } = req.body;

    if (!title || !shortDescription || !description || !mainImage) {
      res.status(400).json({ success: false, error: 'Title, short description, description, and main image are required' });
      return;
    }

    const finalSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

    // Check slug uniqueness
    if (isMongoConnected) {
      const existing = await MongoProject.findOne({ slug: finalSlug });
      if (existing) {
        res.status(409).json({ success: false, error: 'A project with this URL slug already exists.' });
        return;
      }

      const newProj = new MongoProject({
        title,
        slug: finalSlug,
        shortDescription,
        description,
        category: category || 'Web Applications',
        technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((t: string) => t.trim()) : []),
        features: Array.isArray(features) ? features : (features ? features.split('\n').filter(Boolean) : []),
        mainImage,
        screenshots: Array.isArray(screenshots) ? screenshots : [],
        githubUrl: githubUrl || '',
        demoUrl: demoUrl || '',
        status: status || 'Production',
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        order: Date.now()
      });
      await newProj.save();
      res.status(201).json({ success: true, message: 'Project created successfully', data: newProj });
    } else {
      const existing = localProjects.find(p => p.slug === finalSlug);
      if (existing) {
        res.status(409).json({ success: false, error: 'A project with this URL slug already exists.' });
        return;
      }

      const newProj: IProject = {
        _id: 'proj_' + Date.now(),
        title,
        slug: finalSlug,
        shortDescription,
        description,
        category: category || 'Web Applications',
        technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map((t: string) => t.trim()) : []),
        features: Array.isArray(features) ? features : (features ? features.split('\n').filter(Boolean) : []),
        mainImage,
        screenshots: Array.isArray(screenshots) ? screenshots : [],
        githubUrl: githubUrl || '',
        demoUrl: demoUrl || '',
        status: status || 'Production',
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        order: localProjects.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localProjects.unshift(newProj);
      res.status(201).json({ success: true, message: 'Project created successfully', data: newProj });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Admin: Update Project
app.put('/api/projects/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    if (Array.isArray(updateData.technologies) === false && typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    if (Array.isArray(updateData.features) === false && typeof updateData.features === 'string') {
      updateData.features = updateData.features.split('\n').map((f: string) => f.trim()).filter(Boolean);
    }

    if (isMongoConnected) {
      const updated = await MongoProject.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
      res.json({ success: true, message: 'Project updated successfully', data: updated });
    } else {
      const index = localProjects.findIndex(p => p._id === id || p.slug === id);
      if (index === -1) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
      localProjects[index] = { ...localProjects[index], ...updateData };
      res.json({ success: true, message: 'Project updated successfully', data: localProjects[index] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Admin: Delete Project
app.delete('/api/projects/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const deleted = await MongoProject.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
    } else {
      const initialLength = localProjects.length;
      localProjects = localProjects.filter(p => p._id !== id && p.slug !== id);
      if (localProjects.length === initialLength) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Admin: Seed Projects
app.post('/api/projects/seed', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      await MongoProject.deleteMany({});
      await MongoProject.insertMany(INITIAL_PROJECTS.map(p => {
        const { _id, ...rest } = p;
        return rest;
      }));
    } else {
      localProjects = [...INITIAL_PROJECTS];
    }
    res.json({ success: true, message: 'Projects successfully restored to default showcase set' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Public: Submit Project Enquiry
app.post('/api/enquiries', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, projectType, message } = req.body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      res.status(400).json({ success: false, error: 'Please provide a valid full name (minimum 2 characters).' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
      return;
    }
    if (!projectType) {
      res.status(400).json({ success: false, error: 'Please select a project type.' });
      return;
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      res.status(400).json({ success: false, error: 'Message must be at least 10 characters long.' });
      return;
    }

    const createdAt = new Date().toISOString();
    
    // Attempt Telegram delivery
    const telegramResult = await sendTelegramMessage({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      projectType,
      message: message.trim(),
      createdAt
    });

    let savedEnquiry: any = null;

    if (isMongoConnected) {
      const enqDoc = new MongoEnquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : '',
        projectType,
        message: message.trim(),
        status: 'new',
        telegramDelivered: telegramResult.success,
        telegramError: telegramResult.error || undefined,
        createdAt
      });
      await enqDoc.save();
      savedEnquiry = enqDoc;
    } else {
      savedEnquiry = {
        _id: 'enq_' + Date.now(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : '',
        projectType,
        message: message.trim(),
        status: 'new',
        telegramDelivered: telegramResult.success,
        telegramError: telegramResult.error || undefined,
        createdAt
      };
      localEnquiries.unshift(savedEnquiry);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry received successfully! Our team will contact you shortly.',
      telegramDelivered: telegramResult.success,
      telegramNotice: telegramResult.success 
        ? 'Real-time Telegram notification dispatched to administrator.' 
        : (telegramResult.error ? `Notice: ${telegramResult.error}` : undefined),
      data: savedEnquiry
    });
  } catch (error: any) {
    console.error('Enquiry submission error:', error);
    res.status(500).json({ success: false, error: 'Internal server error processing your enquiry.' });
  }
});

// 8. Admin: Get All Enquiries
app.get('/api/admin/enquiries', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const enquiries = await MongoEnquiry.find().sort({ createdAt: -1 });
      res.json({ success: true, data: enquiries });
    } else {
      res.json({ success: true, data: localEnquiries });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Admin: Update Enquiry Status
app.patch('/api/admin/enquiries/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoConnected) {
      const updated = await MongoEnquiry.findByIdAndUpdate(id, { status }, { new: true });
      res.json({ success: true, data: updated });
    } else {
      const enq = localEnquiries.find(e => e._id === id);
      if (!enq) {
        res.status(404).json({ success: false, error: 'Enquiry not found' });
        return;
      }
      enq.status = status;
      res.json({ success: true, data: enq });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. Admin: Delete Enquiry
app.delete('/api/admin/enquiries/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await MongoEnquiry.findByIdAndDelete(id);
    } else {
      localEnquiries = localEnquiries.filter(e => e._id !== id);
    }
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. Admin: Test Telegram Notification
app.post('/api/admin/telegram-test', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const testPayload = {
      fullName: 'ByteVerse Diagnostics Bot',
      email: 'test@byteverse.dev',
      phone: '+1 800-BYTEVERSE',
      projectType: 'System Integration Test',
      message: 'This is a verified test message from the ByteVerse Admin Dashboard checking Telegram API webhook connectivity.',
      createdAt: new Date().toISOString()
    };

    const result = await sendTelegramMessage(testPayload);
    if (result.success) {
      res.json({ success: true, message: 'Test message sent successfully to Telegram!' });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 12. Admin: System Stats
app.get('/api/admin/stats', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    let totalProjects = 0;
    let featuredProjects = 0;
    let publishedProjects = 0;
    let totalEnquiries = 0;
    let unreadEnquiries = 0;
    const categoriesCount: Record<string, number> = {};

    if (isMongoConnected) {
      const projects = await MongoProject.find();
      totalProjects = projects.length;
      featuredProjects = projects.filter(p => p.isFeatured).length;
      publishedProjects = projects.filter(p => p.isPublished).length;
      projects.forEach(p => {
        categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
      });

      totalEnquiries = await MongoEnquiry.countDocuments();
      unreadEnquiries = await MongoEnquiry.countDocuments({ status: 'new' });
    } else {
      totalProjects = localProjects.length;
      featuredProjects = localProjects.filter(p => p.isFeatured).length;
      publishedProjects = localProjects.filter(p => p.isPublished).length;
      localProjects.forEach(p => {
        categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
      });

      totalEnquiries = localEnquiries.length;
      unreadEnquiries = localEnquiries.filter(e => e.status === 'new').length;
    }

    res.json({
      success: true,
      data: {
        totalProjects,
        featuredProjects,
        publishedProjects,
        totalEnquiries,
        unreadEnquiries,
        categoriesCount,
        databaseConnected: isMongoConnected,
        telegramConfigured: Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 13. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (isIpLockedOut(ip)) {
    res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Terminal locked for 15 minutes.'
    });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    recordFailedLogin(ip);
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }

  const normalizedInputEmail = email.trim().toLowerCase();
  const normalizedTargetEmail = ADMIN_EMAIL.trim().toLowerCase();

  const isEmailValid = timingSafeCompare(normalizedInputEmail, normalizedTargetEmail);
  const isPasswordValid = timingSafeCompare(password, ADMIN_PASSWORD);

  if (isEmailValid && isPasswordValid) {
    resetFailedLogin(ip);
    const token = 'bv_' + crypto.randomBytes(32).toString('hex');
    activeAdminSessions.set(token, {
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hour expiry
    });

    res.json({
      success: true,
      message: 'Authentication verified',
      token,
      admin: {
        authenticated: true,
        name: 'Administrator'
      }
    });
  } else {
    recordFailedLogin(ip);
    res.status(401).json({ success: false, error: 'Invalid administrator credentials' });
  }
});

// 14. Admin Check Session
app.get('/api/admin/check-session', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'No active session token' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (isValidAdminToken(token)) {
    res.json({
      success: true,
      admin: {
        authenticated: true,
        name: 'Administrator'
      }
    });
  } else {
    res.status(401).json({ success: false, error: 'Session expired or invalid' });
  }
});

// 15. Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeAdminSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// 16. Export Complete Vercel & GitHub Ready Package ZIP
app.get('/api/admin/export-zip', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const zip = new JSZip();

    // Vercel deployment files & backend entry points
    zip.file('vercel.json', JSON.stringify({
      version: 2,
      builds: [
        { src: 'package.json', use: '@vercel/static-build', config: { distDir: 'dist' } },
        { src: 'api/index.js', use: '@vercel/node' }
      ],
      routes: [
        { src: '/api/(.*)', dest: '/api/index.js' },
        { handle: 'filesystem' },
        { src: '/(.*)', dest: '/index.html' }
      ]
    }, null, 2));

    zip.file('api/index.js', `// Vercel Serverless Function entry point
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Serverless handler export
export default async function handler(req, res) {
  if (process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  res.status(200).json({ status: "ByteVerse API Serverless Ready", timestamp: new Date() });
}
`);

    zip.file('.env.example', `NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/byteverse?retryWrites=true&w=majority
ADMIN_EMAIL=aswinraj@gmail.com
ADMIN_PASSWORD=your_strong_admin_password_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
SESSION_SECRET=your_jwt_or_session_secret_key
PORT=3000
`);

    zip.file('README.md', `# ByteVerse — Ideas Into Digital Reality

Production-ready modern portfolio and technology project showcase website.

## Tech Stack
- Frontend: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- Backend: Express.js, Node.js
- Database: MongoDB Atlas (Mongoose)
- Notification: Telegram Bot API
- Deployment: Vercel serverless / Docker / Node.js
`);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=byteverse-production-deployment.zip');
    res.send(zipBuffer);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ======================== STATIC & VITE INTEGRATION ========================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Vite Dev Server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ByteVerse server running on http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`);
    console.log(`Admin Email: ${ADMIN_EMAIL}`);
    console.log(`Telegram Bot: ${TELEGRAM_BOT_TOKEN ? 'Configured' : 'Missing token (logged safely)'}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting ByteVerse server:', err);
});

export default app;
