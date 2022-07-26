const forms = require("forms");

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (categories, tags) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true
        }),
        'cost': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true
        }),
        'category_id': fields.string({
            label: 'Category',
            required: true,
            errorAfterField: true,
            choices: categories,
            widget: widgets.select()
        }),
        'tags': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: tags
        })
    });
};

const createUserForm = function () {
    return forms.create({
        username: fields.string({
            required: true,
            errorAfterField: true
        }),
        email: fields.string({
            required: true,
            errorAfterField: true
        }),
        password: fields.password({
            required: true,
            errorAfterField: true
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField('password')]
        })
    });
}

const createLoginForm = function () {
    return forms.create({
        email: fields.string({
            required: true,
            errorAfterField: true
        }),
        password: fields.password({
            required: true,
            errorAfterField: true
        })
    })
}

module.exports = {
    createProductForm,
    createUserForm,
    createLoginForm,
    bootstrapField
};