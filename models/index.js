const bookshelf = require("../bookshelf");

const Product = bookshelf.model('Product', {
    tableName: 'products',
    category: function () {
        return this.belongsTo('Category');
    },
    tags: function () {
        return this.belongsToMany('Tag');
    }
});

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    products: function () {
        return this.hasMany('Product');
    }
});

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    products() {
        return this.belongsToMany('Product')
    }
});

module.exports = { Product, Category, Tag };