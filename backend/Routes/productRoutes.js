import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    const product = await Product.find();
    res.send(product)
})

productRouter.get(
    '/categories',
    expressAsyncHandler(async (req, res) => {
      const categories = await Product.find().distinct('category');
      res.send(categories);
    })
  );

productRouter.get('/slug/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: { $eq: req.params.slug } });
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});
productRouter.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});


export default productRouter;