import News from '../models/news.model';
import cloudinary from '../utils/cloudinary';


import NewsService from '../services/news.service';


// @route POST /news
// @desc create a new news
// @access private (admin)
exports.create = async (req, res) => {
   
    try { 
        const {title, content} = req.body;
        const result = await cloudinary.uploader.upload(req.file.path);
        const news = new News({
            ...req.body,
            imageUrl:result.secure_url,
            imageId: result.public_id
            
        })
    
    
        await news.save()
        .then(() => res.redirect('/news'))
        ;
        
    } catch (error) {
        console.log(error);
    }
}

// @route GET /news
// @desc create a new brand
// @access private (admin)
exports.get = async (req, res) => {
   
    try { 
        
        const news = await News.find().sort({createdAt: -1}).lean();
        res.render('news/home',{news})
        
    } catch (error) {
        console.log(error);
    }
}

// @route delete /news/:id
// @desc delete a news
// @access private (admin)
exports.delete = async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id)
        res.redirect('/news')
    } catch (error) {
        console.log(error);
    }
}
// @route get /news/edit/:id
// @desc get data a news
// @access private (admin)
exports.getNewsById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await News.findOne({_id: id}).lean();
        res.render('news/detail',{data})
    } catch (error) {
        console.log(error);
    }
}
// @route get /news/edit/:id
// @desc get data a news
// @access private (admin)
exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await News.findOne({_id: id}).lean();
        res.render('news/edit',{data})
    } catch (error) {
        console.log(error);
    }
}

// @route update /news/updateInfo/:id
// @desc update info of news
// @access private (admin)
exports.updateInformation = async (req, res) => {
    try {
        const id = req.params.id;
        const {title, content} = req.body
        const condition = {_id: id};
        const update = {
            title,
            content
        }
        await News.findOneAndUpdate( condition , update);
        res.redirect(`/news/edit/${id}`)
    } catch (error) {
        console.log(error);
    }
}

// @route update /news/updateImage/:id
// @desc update image of news
// @access private (admin)
exports.updateImage = async (req, res) => {
    try {
        const id = req.params.id;
        const condition = {_id: id};
        const deleteImage = await News.findOne(condition);
        await NewsService.delete(deleteImage.imageId)   

        const result = await NewsService.create(req.file.path)
        console.log(result)
        
        const update = {
            imageUrl: result.secure_url,
            imageId: result.public_id
        }
        await News.findOneAndUpdate( condition , update);


        res.redirect(`/news/edit/${id}`)
    } catch (error) {
        console.log(error);
    }
}