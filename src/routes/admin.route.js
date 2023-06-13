import express from 'express';
import watchController from '../controllers/watch.controller';
import brandController from '../controllers/brand.controller';
import newsController from '../controllers/news.controller';
import upload from '../utils/multer';

const router = express.Router();

router.get('/', (req, res) => res.render('admin/home', {layout: 'admin'}));

// watch route
router.get('/watch', watchController.getProductManager);
router.post('/watch/add', upload.single('image'), watchController.create)
router.post('/watch/update/:id', upload.single('image'), watchController.update)
router.post('/watch/delete/:id', watchController.delete)

// brand route
router.get('/brand', brandController.getAllBrands)
router.post('/brand/add', upload.single('image'), brandController.create)
router.post('/brand/update/:id', upload.single('image'), brandController.update)
router.post('/brand/delete/:id', brandController.delete)

// news route
router.get('/news',newsController.getAllByAdmin)
router.post('/news',upload.single('imageUrl'), newsController.create)
router.get('/news/edit/:id',newsController.getById)
router.post('/news/delete/:id',newsController.delete)
router.post('/news/updateInfo/:id',newsController.updateInformation)
router.post('/news/updateImage/:id', upload.single('imageUrl'),newsController.updateImage)
export default router;
