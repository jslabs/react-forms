# @jslabs/react-forms

## Abstract React forms with SSR and AJV JSON Schema support

### Premilinary docs (example)

```js
// ./schemas/ExampleForm.js (fields)
import React from 'react';

const selectFieldHook = (field, context) => {
    field.props.children = Array.from(field.schema.enum).map(key => <option key={key} value={key}>{key}</option>);
}

export default {
    title: "",
    fields: {
        example_text: {
            label: "Example text",
            element: 'textarea',

        },
        example_input: {
            label: "Example input",
            element: 'input',
            props: {
                type: 'text',
            }
        },
        example_select: {
            label: "Select from SSR schema",
            element: 'select',
            props: {
                value: 'default',
            },
            hooks: [selectFieldHook],
        },
    }
};

```

```js
// field
interface IField {
    element: React.ElementType;
    component: React.ElementType;
    template: React.ElementType;
    props: React.PropsWithChildren<any>;
    label: string;
    schema: IFieldSchema;
    hooks: Array<THook>;
    markup: TFormMarkup;
    prefix: TFormMarkup;
    suffix: TFormMarkup;
    prepend: TFormMarkup;
    append: TFormMarkup;
}
```

```js
// client
import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router';

import DataContext from './DataContext';
import formSchema from './schemas/ExampleForm';

import { Form, FormManager } from '@jslabs/react-forms';

import axios from 'axios';

class ExampleForm extends React.Component {

    static contextType = DataContext;

    constructor(props, context) {
        super(props);
        this.state = context.data.data || {};
        this.submitHandler = this.handleSubmit.bind(this);
        this.stateHandler = this.setState.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        axios.post(event.target.action, this.state)
            .then(({ data }) => {
                if (data.errors) {
                    // @todo
                    alert(JSON.stringify(data.errors, null, 2));
                } else {
                    console.log('response body....', data.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <form method="POST" action={this.props.location.pathname} onSubmit={this.submitHandler}>
                <h3>Example form</h3>
                <FormManager.Provider value={{ state: this.state, setState: this.stateHandler }}>
                    <Form fields={formSchema.fields} schema={this.context.data.schema} />
                </FormManager.Provider>
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default withRouter(ExampleForm);

```

```js
// server
const express = require('express')
const Ajv = require("ajv").default

const router = express.Router()

const errors = require('../handlers/errors')
const exampleSchema = require('../schemas/example')

router.get('/example-form', async (req, res, next) => {

    const data = {
        // ...
    }

    res.locals.data = {
        data: data,
        schema: exampleSchema,
    }

    return next()
})

router.post('/example-form', async (req, res, next) => {

    const body = req.body || {}

    const ajv = new Ajv({ coerceTypes: true })
    const validate = ajv.compile(exampleSchema)
    const valid = validate(body)

    if (valid) {

        // data was validated
    }

    console.log('body....', body)
    console.log('valid....', valid)
    console.log('errors....', validate.errors)

    return res.json({
        data: body,
        valid,
        errors: validate.errors || null,
    })
})
```