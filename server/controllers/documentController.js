import Document from '../models/Document.js';

// جلب إحصائيات لوحة التحكم
export const getStats = async (req, res, next) => {
  try {
    const total = await Document.countDocuments();
    const published = await Document.countDocuments({ status: 'Published' });
    const pending = await Document.countDocuments({ status: 'Pending Review' });
    const expired = await Document.countDocuments({
      expiryDate: { $lt: new Date(), $ne: null }
    });

    const deptStats = await Document.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: { total, published, pending, expired, byDepartment: deptStats }
    });
  } catch (error) {
    next(error);
  }
};

// جلب أحدث المستندات
export const getRecent = async (req, res, next) => {
  try {
    const docs = await Document.find({})
      .sort({ updatedAt: -1 })
      .limit(6)
      .populate('createdBy', 'name');
    res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
};

// البحث الذكي
export const searchDocuments = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const docs = await Document.find(
      { $text: { $search: query }, status: 'Published' },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('createdBy', 'name');

    if (docs.length === 0) {
      const fallbackDocs = await Document.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { keywords: { $regex: query, $options: 'i' } },
          { docNumber: { $regex: query, $options: 'i' } }
        ],
        status: 'Published'
      }).populate('createdBy', 'name');
      return res.json({ success: true, data: fallbackDocs });
    }

    res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
};

// إنشاء مستند جديد
export const createDocument = async (req, res, next) => {
  try {
    const { title, docNumber, category, department, description, keywords, fileUrl, reviewDate, expiryDate } = req.body;

    if (!title || !docNumber) {
      return res.status(400).json({
        success: false,
        message: 'Title and document number are required'
      });
    }

    const existing = await Document.findOne({ docNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Document number already exists'
      });
    }

    const newDocument = new Document({
      title,
      docNumber,
      category: category || 'Protocol',
      department: department || 'General',
      description: description || '',
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
      status: 'Draft',
      versions: [{
        versionNumber: '1.0',
        fileUrl: fileUrl || 'uploads/temp.pdf',
        uploadedBy: req.user.id,
        changeNotes: 'Initial version'
      }],
      reviewDate: reviewDate ? new Date(reviewDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      createdBy: req.user.id,
    });

    await newDocument.save();
    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: newDocument
    });
  } catch (error) {
    next(error);
  }
};

// جلب جميع المستندات
export const getAllDocuments = async (req, res, next) => {
  try {
    const { category, department, status } = req.query;
    const filter = {};

    if (req.user.role === 'Staff') {
      filter.status = 'Published';
    } else if (status) {
      filter.status = status;
    }

    if (category) filter.category = category;
    if (department) filter.department = department;

    const docs = await Document.find(filter)
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name')
      .populate('approvedBy', 'name');

    res.json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
};

// جلب مستند محدد بالمعرف
export const getDocumentById = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('approvedBy', 'name');

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (req.user.role === 'Staff' && doc.status !== 'Published') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

// تحديث مستند
export const updateDocument = async (req, res, next) => {
  try {
    const { title, category, department, description, keywords, status, reviewDate, expiryDate } = req.body;

    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (title) doc.title = title;
    if (category) doc.category = category;
    if (department) doc.department = department;
    if (description) doc.description = description;
    if (keywords) doc.keywords = keywords.split(',').map(k => k.trim());
    if (status) doc.status = status;
    if (reviewDate) doc.reviewDate = new Date(reviewDate);
    if (expiryDate) doc.expiryDate = new Date(expiryDate);

    if (status === 'Published') {
      doc.publishedAt = new Date();
      if (req.user.id) doc.approvedBy = req.user.id;
    }

    await doc.save();
    res.json({ success: true, message: 'Document updated successfully', data: doc });
  } catch (error) {
    next(error);
  }
};

// حذف مستند (Admin فقط)
export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// إضافة إصدار جديد
export const addVersion = async (req, res, next) => {
  try {
    const { fileUrl, changeNotes } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'File URL is required' });
    }

    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const versions = doc.versions || [];
    const lastVersion = versions.length > 0 ? versions[versions.length - 1] : null;
    let newVersionNumber = '1.0';
    if (lastVersion) {
      const parts = lastVersion.versionNumber.split('.');
      const major = parseInt(parts[0]);
      const minor = parseInt(parts[1]) + 1;
      newVersionNumber = `${major}.${minor}`;
    }

    const newVersion = {
      versionNumber: newVersionNumber,
      fileUrl,
      uploadedBy: req.user.id,
      changeNotes: changeNotes || 'New version uploaded'
    };

    doc.versions.push(newVersion);
    await doc.save();

    res.json({ success: true, message: 'New version added', data: newVersion });
  } catch (error) {
    next(error);
  }
};

// جلب جميع الإصدارات لمستند معين
export const getVersions = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).select('versions');
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, data: doc.versions || [] });
  } catch (error) {
    next(error);
  }
};