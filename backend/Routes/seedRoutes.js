import express from 'express'
import data from '../data.js';
import Product from '../Models/ProductModel.js'

const seedRouter = express.Router()

seedRouter.get('/', async (req,res) =>{
    await Product.remove({});
    const createProducts = await Product.insertMany(data.products)
    res.send(createProducts)
})

export default seedRouter