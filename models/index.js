const bookshelf = require("../bookshelf");

const Product = bookshelf.model('Product', {
    tableName: 'products',
    category: function () {
        return this.belongsTo('Category');
    }
});

const Category = bookshelf.model('Categories', {
    tableName: 'categories',
    products: function () {
        return this.hasMany('Product')
    }
})

module.exports = { Product, Category };