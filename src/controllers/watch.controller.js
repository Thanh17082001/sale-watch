import watchService from '../services/watch.service';
import commentServices from '../services/comment.service'
import cloudinary from "../utils/cloudinary";

// @route GET /admin/watch?currentPage=...
// @desc get watches for product manager function
// @access private
exports.getProductManager = async (req, res) => {
    try {
        const currentPage = req.query.currentPage || '1';
        const response = await watchService.findAllAndPage(currentPage);

        res.render('admin/watch', {
            layout: 'admin',
            response,
            message: req.session.message,
            success: req.session.success,
            helpers: {
                getTemplateEditSelect: (index, attr) => {
                    let template = '';
                    switch (attr) {
                        case 'brand':
                            template = response.brands.map(brand => {
                                if (brand.name === response.watches[index].brandId.name)
                                    return `<option value="${brand._id}" selected='selected'>${brand.name}</option>`
                                else return `<option value="${brand._id}">${brand.name}</option>`
                            })
                            return template;
                        case 'style':
                            const styles = ['Sang trọng', 'Thể thao', 'Thời trang', 'Hiện đại', 'Quân đội'];
                            template = styles.map(style => {
                                if (style === response.watches[index].style)
                                    return `<option value="${style}" selected='selected'>${style}</option>`
                                else return `<option value="${style}">${style}</option>`
                            })
                            return template;
                        case 'glass':
                            const glasses = ['Sapphire (Kính Chống Trầy)', 'Kính khoáng Mineral (Kính cứng)', 'Resin Glass (Kính Nhựa)'];
                            template = glasses.map(glass => {
                                if (glass === response.watches[index].glass)
                                    return `<option value="${glass}" selected='selected'>${glass}</option>`
                                else return `<option value="${glass}">${glass}</option>`
                            })
                            return template;
                        case 'strap':
                            const straps = ['Thép không gỉ', 'Cao su', 'Dây da', 'Hợp kim'];
                            template = straps.map(strap => {
                                if (strap === response.watches[index].strap)
                                    return `<option value="${strap}" selected='selected'>${strap}</option>`
                                else return `<option value="${strap}">${strap}</option>`
                            })
                            return template;
                        case 'principleOperate':
                            const operates = ['Cơ tự động (Automatic)', 'Quartz (Pin)'];
                            template = operates.map(operate => {
                                if (operate === response.watches[index].principleOperate)
                                    return `<option value="${operate}" selected='selected'>${operate}</option>`
                                else return `<option value="${operate}">${operate}</option>`
                            })
                            return template;
                        default:
                            return null;
                    }
                },
                clearMessage: () => {
                    req.session.message = undefined;
                    req.session.success = undefined;
                }
            }
        });
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        return res.redirect('/admin/watch')
    }
}

// @route GET /watch/:id
// @access public
exports.getProductDetail = async (req, res) => {
    try {
        const watchId = req.params.id;

        const response = await watchService.findById(watchId);
        const suggestWatches = (await watchService.findAll({ brandId: response.watch.brandId, _id: { $ne: response.watch._id } }, 4, { price: -1 })).watches;
        // comment

        const result = await commentServices.findAllByWatchId(req.params.id)
        var data = [];
        for (let i = 0; i < result.length; i++) {
            let starElement = []
            for (let j = 0; j < parseInt(result[i].rate); j++) {
                starElement.push(1)
            }
          
            const temp = {
                element: starElement,
                ...result[i],
            }
            data.push(temp)
        }
        // comment        
        res.render('productDetail', {
            watch: response.watch,
            data,
            message : req.session.message,
            success : req.session.success,
            suggestWatches,
            user: req.session.authState?.user,
            helpers: {
                clearMessage: () => {
                    req.session.message = undefined;
                    req.session.success = undefined;
                }
            }
        })
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        res.render('err404', { layout: false });
    }
}

// @route POST /admin/watch/add
// @desc create a new product
// @access private
exports.create = async (req, res) => {
    if (!req.body.name || !req.body.brandId || !req.file) {
        req.session.message = 'Tên sản phẩm, hình ảnh và thương hiệu không thể bỏ trống!';
        req.session.success = false;
        return res.redirect('/admin/watch');
    }
    try {
        const userId = req.session.authState?.user._id;

        const data = {
            name: req.body.name,
            brandId: req.body.brandId,
            style: req.body.style,
            imageUrl: req.file.path,
            strap: req.body.strap,
            glass: req.body.glass,
            principleOperate: req.body.principleOperate,
            description: req.body.description
        }

        const response = await watchService.create(data, userId);
        req.session.message = response.msg;
        req.session.success = response.success;
        return res.redirect('/admin/watch');
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        return res.redirect('/admin/watch');
    }
}

// @route POST /admin/watch/update/:id
// @access private
exports.update = async (req, res) => {
    try {
        const userId = req.session.authState?.user._id;
        const watchId = req.params.id;

        const data = {
            name: req.body.name,
            brandId: req.body.brandId,
            style: req.body.style,
            imageUrl: req.file?.path,
            price: req.body.price,
            strap: req.body.strap,
            glass: req.body.glass,
            principleOperate: req.body.principleOperate,
            description: req.body.description,
        }

        const response = await watchService.update(data, watchId, userId);
        req.session.message = response.msg;
        req.session.success = response.success;
        req.session.activeProduct = true; 
        return res.redirect('back');
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        return res.redirect('/admin/watch')
    }
}

// @route POST /admin/watch/delete/:id
// @access private
exports.delete = async (req, res) => {
    try {
        const watchId = req.params.id;

        const response = await watchService.delete(watchId);
        req.session.message = response.msg;
        req.session.success = response.success;
        return res.redirect('/admin/watch');
    } catch (error) {
        console.log(error);
        req.session.message = 'Internal server error';
        req.session.success = false;
        return res.redirect('/admin/watch');
    }
}