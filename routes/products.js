const express = require('express');
const router = express.Router();

const { Product, Category, Tag } = require('../models');
const { createProductForm, bootstrapField } = require('../forms');
const { checkIfAuthenticated } = require('../middlewares');

router.get('/', async function (req, res) {
    let products = await Product.collection().fetch({
        withRelated: ['category']
    });
    res.render('products/index', {
        products: products.toJSON()
    })
})

router.get('/create', checkIfAuthenticated, async function (req, res) {
    const categories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);
    const productForm = createProductForm(categories, allTags);
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    });
})

router.post('/create', checkIfAuthenticated, async function (req, res) {
    const productForm = createProductForm();
    productForm.handle(req, {
        success: async function (form) {
            let { tags, ...productData } = form.data;
            const product = new Product(productData);
            await product.save();
            if (tags) {
                await product.tags().attach(tags.split(","));
            }
            req.flash('success_messages', 'Success')
            res.redirect('/products');
        },
        error: function (form) {
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            });
        },
        empty: function (form) { }
    })
})

router.get('/:product_id/update', async function (req, res) {
    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true,
        withRelated: ['tags']
    });
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);
    const categories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);
    const productForm = createProductForm(categories, allTags);
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');

    let selectedTags = await product.related('tags').pluck('id');
    productForm.fields.tags.value = selectedTags;

    res.render('products/update', {
        form: productForm.toHTML(bootstrapField),
        product: product.toJSON()
    })
})

router.post('/:product_id/update', async function (req, res) {
    const categories = await Category.fetchAll().map(category => [category.get('id'), category.get('name')]);
    const productForm = createProductForm(categories);
    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true
    });
    productForm.handle(req, {
        success: async function (form) {
            product.set(form.data);
            product.save();
            res.redirect('/products')
        },
        error: async function (form) {
            res.render('products/update', {
                form: productForm.toHTML(bootstrapField),
                product: product.toJSON
            })
        },
        empty: async function (form) {
            res.render('products/update', {
                form: productForm.toHTML(bootstrapField),
                product: product.toJSON
            })
        }
    })
})

router.get('/:product_id/delete', async function (req, res) {
    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true
    });
    res.render('products/delete', {
        product: product.toJSON()
    })
})

router.post('/:product_id/delete', async function (req, res) {
    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
})

module.exports = router;