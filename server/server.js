import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dns from "node:dns";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const JWT_SECRET = "91ac4edf1366c70464f8ca03334623e5ce11f993537456b0baa4ae9b50337eece994d0d466f10195b2cc2481dc5d8c2455afc63f51eedc6b75957bea01ca2366";

// ============================================================
// 🗄️ اتصال MongoDB (Native Driver)
// ============================================================

const uri = "mongodb+srv://admin:admin@cluster0.1f4z64f.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

let db;
let usersCollection;
let documentsCollection;
let workshopsCollection;
let updatesCollection;
let newsCollection;
let eventsCollection;
let contributionsCollection;
let servicesCollection;

// دالة مساعدة لإنشاء الفهارس بأمان
async function createIndexSafe(collection, spec, options, nameHint = '') {
  try {
    await collection.createIndex(spec, options);
    console.log(`✅ Index created: ${nameHint || JSON.stringify(spec)}`);
  } catch (err) {
    console.warn(`⚠️ Index creation skipped for ${nameHint || JSON.stringify(spec)}: ${err.message}`);
  }
}

async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db("health_kms");

    usersCollection = db.collection("users");
    documentsCollection = db.collection("documents");
    workshopsCollection = db.collection("workshops");
    updatesCollection = db.collection("updates");
    newsCollection = db.collection("news");
    eventsCollection = db.collection("events");
    contributionsCollection = db.collection("contributions");
    servicesCollection = db.collection("services");

    // إنشاء الفهارس مع تجاهل الأخطاء
    await createIndexSafe(usersCollection, { email: 1 }, { unique: true }, 'email_unique');
    await createIndexSafe(usersCollection, { staffNumber: 1 }, { unique: true, sparse: true }, 'staffNumber_unique');
    await createIndexSafe(documentsCollection, { title: "text", description: "text" }, {}, 'title_text_description_text');
    await createIndexSafe(documentsCollection, { category: 1 }, {}, 'category');
    await createIndexSafe(documentsCollection, { subCategory: 1 }, {}, 'subCategory'); // ✅ إضافة فهرس subCategory
    await createIndexSafe(documentsCollection, { department: 1 }, {}, 'department');
    await createIndexSafe(documentsCollection, { status: 1 }, {}, 'status');
    await createIndexSafe(workshopsCollection, { title: "text", description: "text" }, {}, 'workshops_title_text_description_text');
    await createIndexSafe(updatesCollection, { title: "text", description: "text" }, {}, 'updates_title_text_description_text');
    await createIndexSafe(newsCollection, { title: "text", description: "text" }, {}, 'news_title_text_description_text');
    await createIndexSafe(eventsCollection, { title: "text", description: "text" }, {}, 'events_title_text_description_text');
    await createIndexSafe(contributionsCollection, { title: "text", description: "text" }, {}, 'contributions_title_text_description_text');
    await createIndexSafe(servicesCollection, { title: 1 }, {}, 'services_title');

    // 👑 إنشاء حساب أدمن افتراضي
    const defaultAdmin = {
      name: "System Admin",
      email: "admin@hospital.com",
      staffNumber: "ADMIN001",
      password: await bcrypt.hash("admin123", 10),
      role: "Admin",
      department: "General",
      isActive: true,
      createdAt: new Date()
    };

    const existingAdmin = await usersCollection.findOne({ email: defaultAdmin.email });
    if (!existingAdmin) {
      await usersCollection.insertOne(defaultAdmin);
      console.log("✅ Default Admin created: admin@hospital.com / admin123");
    } else {
      console.log("✅ Admin already exists");
    }

    // 👑 إضافة حساب أدمن إضافي
    const additionalAdmin = {
      name: "Admin Extra",
      email: "admin2@hospital.com",
      staffNumber: "STF1001",
      password: await bcrypt.hash("123456", 10),
      role: "Admin",
      department: "General",
      isActive: true,
      createdAt: new Date()
    };

    const existingAdmin2 = await usersCollection.findOne({ staffNumber: additionalAdmin.staffNumber });
    if (!existingAdmin2) {
      await usersCollection.insertOne(additionalAdmin);
      console.log("✅ Additional Admin created: staffNumber=STF1001 / password=123456");
    } else {
      if (existingAdmin2.role !== "Admin") {
        await usersCollection.updateOne(
          { staffNumber: additionalAdmin.staffNumber },
          { $set: { role: "Admin" } }
        );
        console.log("✅ Updated role to Admin for STF1001");
      }
      console.log("✅ Additional Admin already exists");
    }

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}

// ============================================================
// 🔐 Middleware للمصادقة والصلاحيات
// ============================================================

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};

// ============================================================
// 📂 إعدادات رفع الملفات (Multer)
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|mp4|webm|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images, documents, and videos are allowed'));
  }
});

// ============================================================
// 🔐 مسارات المصادقة (للأدمن فقط)
// ============================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { staffNumber, password } = req.body;

    if (!staffNumber) {
      return res.status(400).json({ success: false, message: "Staff number is required" });
    }

    const user = await usersCollection.findOne({ staffNumber: staffNumber.trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid staff number or password" });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: "Account is deactivated" });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid staff number or password" });
    }

    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        staffNumber: user.staffNumber,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
});

// ============================================================
// 📄 مسارات المستندات (قراءة عامة، كتابة للأدمن)
// ============================================================

// ✅ جلب جميع المستندات مع دعم تصفية subCategory
app.get("/api/documents", async (req, res) => {
  try {
    const { category, subCategory, department, status, limit } = req.query;
    const query = {};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (department) query.department = department;
    if (status) query.status = status;

    let cursor = documentsCollection.find(query, { projection: { fileData: 0 } });
    if (limit) {
      cursor = cursor.limit(parseInt(limit));
    }
    const documents = await cursor.toArray();
    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// جلب مستند واحد (عام)
app.get("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const document = await documentsCollection.findOne({ _id: new ObjectId(id) });
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ بحث في المستندات مع دعم subCategory
app.get("/api/documents/search", async (req, res) => {
  try {
    const { q, category, subCategory, department, status } = req.query;
    const query = {};
    if (q && q.trim()) {
      query.$text = { $search: q.trim() };
    }
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (department) query.department = department;
    if (status) query.status = status;

    const documents = await documentsCollection.find(query, { projection: { fileData: 0 } }).toArray();
    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ إضافة مستند (الملف اختياري للسياسات والبروتوكولات)
app.post("/api/documents", verifyToken, authorize("Admin"), upload.single('file'), async (req, res) => {
  try {
    const { title, category, subCategory, department, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // التحقق: إذا لم تكن الفئة Policy أو Protocol، يجب رفع ملف
    const isPolicyOrProtocol = (category === 'Policy' || category === 'Protocol');
    if (!isPolicyOrProtocol && !req.file) {
      return res.status(400).json({ success: false, message: "File is required for this category" });
    }

    const newDocument = {
      title,
      category: category || 'Protocol',
      subCategory: subCategory || '',
      department: department || 'General',
      description: description || '',
      status: status || 'Published',
      version: 1,
      uploadedBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // إذا تم رفع ملف
    if (req.file) {
      newDocument.fileUrl = `/uploads/${req.file.filename}`;
      newDocument.fileSize = req.file.size;
      newDocument.fileType = req.file.mimetype;
    } else {
      // للسياسات والبروتوكولات، لا يوجد ملف
      newDocument.fileUrl = null;
      newDocument.fileSize = null;
      newDocument.fileType = null;
    }

    const result = await documentsCollection.insertOne(newDocument);
    res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: { ...newDocument, _id: result.insertedId }
    });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ تحديث مستند (مع دعم subCategory والملف اختياري)
app.put("/api/documents/:id", verifyToken, authorize("Admin"), upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, subCategory, department, description, status } = req.body;
    const updateData = { updatedAt: new Date() };

    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (subCategory) updateData.subCategory = subCategory;
    if (department) updateData.department = department;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    if (req.file) {
      updateData.fileUrl = `/uploads/${req.file.filename}`;
      updateData.fileSize = req.file.size;
      updateData.fileType = req.file.mimetype;
    }

    const result = await documentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    res.json({ success: true, message: "Document updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// حذف مستند (للأدمن فقط)
app.delete("/api/documents/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await documentsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 🎓 مسارات الورش (قراءة عامة، كتابة للأدمن)
// ============================================================

// جلب جميع الورش (عام)
app.get("/api/workshops", async (req, res) => {
  try {
    const workshops = await workshopsCollection.find().toArray();
    res.json({ success: true, data: workshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// جلب ورشة واحدة (عام)
app.get("/api/workshops/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await workshopsCollection.findOne({ _id: new ObjectId(id) });
    if (!workshop) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.json({ success: true, data: workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// إضافة ورشة (للأدمن فقط)
app.post("/api/workshops", verifyToken, authorize("Admin"), upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const images = req.files['images'] ? req.files['images'].map(f => `/uploads/${f.filename}`) : [];
    const videos = req.files['videos'] ? req.files['videos'].map(f => `/uploads/${f.filename}`) : [];

    const newWorkshop = {
      title,
      description: description || '',
      images,
      videos,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await workshopsCollection.insertOne(newWorkshop);
    res.status(201).json({
      success: true,
      message: "Workshop created successfully",
      data: { ...newWorkshop, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// تحديث ورشة (للأدمن فقط)
app.put("/api/workshops/:id", verifyToken, authorize("Admin"), upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, existingImages, existingVideos } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const newImages = req.files['images'] ? req.files['images'].map(f => `/uploads/${f.filename}`) : [];
    const newVideos = req.files['videos'] ? req.files['videos'].map(f => `/uploads/${f.filename}`) : [];

    let images = [];
    let videos = [];
    if (existingImages) {
      try { images = JSON.parse(existingImages); } catch (e) { images = []; }
    }
    if (existingVideos) {
      try { videos = JSON.parse(existingVideos); } catch (e) { videos = []; }
    }
    images = [...images, ...newImages];
    videos = [...videos, ...newVideos];

    updateData.images = images;
    updateData.videos = videos;
    updateData.updatedAt = new Date();

    const result = await workshopsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.json({ success: true, message: "Workshop updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// حذف ورشة (للأدمن فقط)
app.delete("/api/workshops/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await workshopsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Workshop not found" });
    }
    res.json({ success: true, message: "Workshop deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 📢 مسارات التحديثات (قراءة عامة، كتابة للأدمن)
// ============================================================

// جلب جميع التحديثات (عام)
app.get("/api/updates", async (req, res) => {
  try {
    const updates = await updatesCollection.find().sort({ date: -1 }).toArray();
    res.json({ success: true, data: updates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// جلب التحديثات الأخيرة (عام)
app.get("/api/updates/recent", async (req, res) => {
  try {
    const updates = await updatesCollection.find().sort({ date: -1 }).limit(5).toArray();
    res.json({ success: true, data: updates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// إضافة تحديث (للأدمن فقط)
app.post("/api/updates", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { title, description, type, date } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newUpdate = {
      title,
      description: description || '',
      type: type || 'general',
      date: date ? new Date(date) : new Date(),
      createdAt: new Date()
    };

    const result = await updatesCollection.insertOne(newUpdate);
    res.status(201).json({
      success: true,
      message: "Update added successfully",
      data: { ...newUpdate, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// حذف تحديث (للأدمن فقط)
app.delete("/api/updates/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updatesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Update not found" });
    }
    res.json({ success: true, message: "Update deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 📰 مسارات الأخبار (قراءة عامة، كتابة للأدمن)
// ============================================================

app.get("/api/news", async (req, res) => {
  try {
    const { limit, isActive } = req.query;
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else {
      query.isActive = true;
    }
    let cursor = newsCollection.find(query).sort({ date: -1 });
    if (limit) {
      cursor = cursor.limit(parseInt(limit));
    }
    const news = await cursor.toArray();
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newsItem = await newsCollection.findOne({ _id: new ObjectId(id) });
    if (!newsItem) {
      return res.status(404).json({ success: false, message: "News not found" });
    }
    res.json({ success: true, data: newsItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/news", verifyToken, authorize("Admin"), upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, isActive } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newNews = {
      title,
      description: description || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      date: date ? new Date(date) : new Date(),
      isActive: isActive === 'true' ? true : (isActive === 'false' ? false : true),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await newsCollection.insertOne(newNews);
    res.status(201).json({
      success: true,
      message: "News added successfully",
      data: { ...newNews, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/news/:id", verifyToken, authorize("Admin"), upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, isActive } = req.body;
    const updateData = { updatedAt: new Date() };
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (isActive !== undefined) updateData.isActive = isActive === 'true';
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const result = await newsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "News not found" });
    }
    res.json({ success: true, message: "News updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/news/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await newsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "News not found" });
    }
    res.json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 📅 مسارات الفعاليات (قراءة عامة، كتابة للأدمن)
// ============================================================

app.get("/api/events", async (req, res) => {
  try {
    const { limit, isActive } = req.query;
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else {
      query.isActive = true;
    }
    let cursor = eventsCollection.find(query).sort({ date: -1 });
    if (limit) {
      cursor = cursor.limit(parseInt(limit));
    }
    const events = await cursor.toArray();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/events", verifyToken, authorize("Admin"), upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, location, isActive } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newEvent = {
      title,
      description: description || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      date: date ? new Date(date) : new Date(),
      location: location || '',
      isActive: isActive === 'true' ? true : (isActive === 'false' ? false : true),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await eventsCollection.insertOne(newEvent);
    res.status(201).json({
      success: true,
      message: "Event added successfully",
      data: { ...newEvent, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/events/:id", verifyToken, authorize("Admin"), upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, isActive } = req.body;
    const updateData = { updatedAt: new Date() };
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (location !== undefined) updateData.location = location;
    if (isActive !== undefined) updateData.isActive = isActive === 'true';
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/events/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 🤝 مسارات المبادرات المجتمعية (قراءة عامة، كتابة للأدمن)
// ============================================================

app.get("/api/contributions", async (req, res) => {
  try {
    const { limit, isActive } = req.query;
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else {
      query.isActive = true;
    }
    let cursor = contributionsCollection.find(query).sort({ date: -1 });
    if (limit) {
      cursor = cursor.limit(parseInt(limit));
    }
    const contributions = await cursor.toArray();
    res.json({ success: true, data: contributions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/contributions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contribution = await contributionsCollection.findOne({ _id: new ObjectId(id) });
    if (!contribution) {
      return res.status(404).json({ success: false, message: "Contribution not found" });
    }
    res.json({ success: true, data: contribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/contributions", verifyToken, authorize("Admin"), upload.single('image'), async (req, res) => {
  try {
    const { title, description, type, date, isActive } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newContribution = {
      title,
      description: description || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      type: type || 'تطوع',
      date: date ? new Date(date) : new Date(),
      isActive: isActive === 'true' ? true : (isActive === 'false' ? false : true),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await contributionsCollection.insertOne(newContribution);
    res.status(201).json({
      success: true,
      message: "Contribution added successfully",
      data: { ...newContribution, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/contributions/:id", verifyToken, authorize("Admin"), upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, date, isActive } = req.body;
    const updateData = { updatedAt: new Date() };
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type) updateData.type = type;
    if (date) updateData.date = new Date(date);
    if (isActive !== undefined) updateData.isActive = isActive === 'true';
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const result = await contributionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Contribution not found" });
    }
    res.json({ success: true, message: "Contribution updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/contributions/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contributionsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Contribution not found" });
    }
    res.json({ success: true, message: "Contribution deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 🩺 مسارات الخدمات (قراءة عامة، كتابة للأدمن)
// ============================================================

app.get("/api/services", async (req, res) => {
  try {
    const services = await servicesCollection.find().sort({ order: 1, createdAt: -1 }).toArray();
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await servicesCollection.findOne({ _id: new ObjectId(id) });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/services", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { title, description, order } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newService = {
      title,
      description: description || '',
      order: order ? parseInt(order) : 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await servicesCollection.insertOne(newService);
    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: { ...newService, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/services/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;
    const updateData = { updatedAt: new Date() };
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = parseInt(order);

    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/services/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 📊 مسارات الإحصائيات (عامة)
// ============================================================

app.get("/api/stats", async (req, res) => {
  try {
    const totalUsers = await usersCollection.countDocuments();
    const totalDocuments = await documentsCollection.countDocuments();
    const totalWorkshops = await workshopsCollection.countDocuments();
    const totalUpdates = await updatesCollection.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDocuments,
        totalWorkshops,
        totalUpdates
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 👥 مسارات المستخدمين (للأدمن فقط)
// ============================================================

app.get("/api/users", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/users/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, isActive } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (department) updateData.department = department;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/users/:id", verifyToken, authorize("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// تغيير كلمة المرور (للمستخدم نفسه)
app.put("/api/users/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required" });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { password: hashed } }
    );

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// 📂 خدمة الملفات الثابتة (الصور والفيديوهات والمستندات)
// ============================================================

app.use('/uploads', express.static('uploads'));

// ============================================================
// 🧪 اختبار
// ============================================================

app.get("/", (req, res) => {
  res.send("🚀 Health Knowledge Management System - Server is running!");
});

// ============================================================
// 🚀 تشغيل الخادم (بعد الاتصال بقاعدة البيانات)
// ============================================================

const PORT = 5000;

connectToMongoDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
      console.log(`👑 Admin credentials: email=admin@hospital.com, password=admin123`);
      console.log(`👑 Admin (STF1001):   staffNumber=STF1001, password=123456`);
      console.log(`📄 Documents API:   /api/documents (GET public, POST/PUT/DELETE Admin only)`);
      console.log(`🎓 Workshops API:    /api/workshops (GET public, POST/PUT/DELETE Admin only)`);
      console.log(`📢 Updates API:      /api/updates (GET public, POST/DELETE Admin only)`);
      console.log(`📰 News API:         /api/news (GET public, POST/PUT/DELETE Admin only)`);
      console.log(`📅 Events API:       /api/events (GET public, POST/PUT/DELETE Admin only)`);
      console.log(`🤝 Contributions API:/api/contributions (GET public, POST/PUT/DELETE Admin only)`);
      console.log(`🩺 Services API:     /api/services (GET public, POST/PUT/DELETE Admin only)`);
      console.log(`📊 Stats API:        /api/stats (public)`);
      console.log(`👤 Users API:        /api/users (Admin only)`);
      console.log(`🔐 Login:            /api/auth/login (Admin only)`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to start server due to MongoDB connection error:", err.message);
    process.exit(1);
  });