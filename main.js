const jsonServer = require('json-server');
const queryString = require('query-string');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './public',
});
const uniqid = require('uniqid');
const multer = require('multer');
const fs = require('fs');

// Setup upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = './public/posts';
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    const [fileName, fileExtension] = file.originalname.split('.');
    cb(null, uniqid(`${fileName}-`, `.${fileExtension}`));
  },
});

const upload = multer({ storage });

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  } else if (req.method === 'PATCH') {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

function handleAddPost(req, res, next) {
  const now = Date.now();

  if (req.file?.filename) {
    req.body.imageUrl = `${process.env.STATIC_URL}/posts/${req.file?.filename}`;
  }

  req.body.createdAt = now;
  req.body.updatedAt = now;
  next();
}

function handleUpdatePost(req, res, next) {
  const now = Date.now();

  if (req.file?.filename) {
    req.body.imageUrl = `${process.env.STATIC_URL}/posts/${req.file?.filename}`;
  }

  req.body.updatedAt = now;
  next();
}

function validateFormData(req, res, next) {
  const contentType = req.headers['content-type'];
  if (!contentType.includes('multipart/form-data')) {
    return res
      .status(400)
      .json({ error: 'Invalid Content-Type, only multipart/form-data is supported.' });
  }

  next();
}

function handleUploadFile(req, res, next) {
  if (!['PATCH', 'POST'].includes(req.method)) {
    return res.status(404).json({ error: 'Not Found' });
  }

  if (req.method === 'PATCH') return handleUpdatePost(req, res, next);

  return handleAddPost(req, res, next);
}

server.use(
  '/api/with-thumbnail',
  validateFormData,
  upload.single('image'),
  handleUploadFile,
  router
);

// Custom ouput for LIST with pagination
router.render = (req, res) => {
  // Check GET with pagination
  // If yes, custom output
  const headers = res.getHeaders();

  const totalCountHeader = headers['x-total-count'];
  if (req.method === 'GET' && totalCountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);

    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 12,
        _totalRows: Number.parseInt(totalCountHeader),
      },
    };

    return res.jsonp(result);
  }

  // Otherwise, keep default behavior
  res.jsonp(res.locals.data);
};

// Use default router
const PORT = process.env.PORT || 3000;
server.use('/api', router);
server.listen(PORT, () => {
  console.log('JSON Server is running');
});
