import express from 'express';
import watchController from '../controllers/watch.controller';
import brandController from '../controllers/brand.controller';
import newsController from '../controllers/news.controller';
import warehouseController from '../controllers/warehouse.controller';
import roleController from '../controllers/role.controller';
import turnoverController from '../controllers/turnover.controller';
import orderController from '../controllers/order.controller'
import userController from '../controllers/user.controller';
import {verifyAdmin} from '../middleware/auth';
import {verifyAddProduct, verifyUpdateProduct, verifyCreateAddReceipt} from '../middleware/role'
import upload from '../utils/multer';

const router = express.Router();

router.get('/', (req, res) => res.render('admin/home', {
    layout: 'admin',
    message: req.session.message,
    success: req.session.success,
    helpers: {
        clearMessage: () => req.session.message = undefined
    }
}));

// watch route
router.get('/watch', watchController.getProductManager);
router.post('/watch/add',verifyAddProduct, upload.single('image'), watchController.create)
router.post('/watch/update/:id',verifyUpdateProduct, upload.single('image'), watchController.update)
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
// warehouse route
router.get('/warehouse', warehouseController.getHomePage);
router.post('/warehouse/add', verifyCreateAddReceipt, warehouseController.createAddReceipt);
// role route
router.post('/role/create', verifyAdmin, roleController.createRole)
router.post('/role/update-role/:id', verifyAdmin, roleController.updateRole)
router.get('/role/role-detail/:id', verifyAdmin, roleController.roleUser)
router.get('/role/role-edit/:id', verifyAdmin, roleController.displayRoleEdit)
router.get('/role/role-delete/:id', verifyAdmin, roleController.deleteRole)
router.post('/role/role-edit/:id', verifyAdmin, roleController.roleEdit)
router.get('/role/role-create', verifyAdmin, roleController.displayCreateRole)
router.get('/role', verifyAdmin, roleController.displayRole)

// turnover routes
router.get('/turnover', turnoverController.display)
// order route
router.get('/order', orderController.getAllOrders)
router.get('/order/:id', orderController.getOrderIdByAdmin)
router.post('/order/confirm/:id', orderController.updateOrder)
//user route
router.get('/user',verifyAdmin,userController.displayUserManager)
router.get('/user/toggle',verifyAdmin,userController.unlockUser)

export default router;
