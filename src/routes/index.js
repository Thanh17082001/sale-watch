import brandRouter from './brand.route';
import userRouter from './user.route';

const initRoutes = (app) => {
    app.use('/brand', brandRouter);
    app.use('/user', userRouter);
}

export default initRoutes;
