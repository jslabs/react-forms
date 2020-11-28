# @jslabs/react-forms

## Abstract React forms with SSR and AJV JSON Schema support

### Premilinary docs (example)

```js
// server/schemas/example.js
module.exports = {
    "additionalProperties": false,
    "type": "object",
    "properties": {
        "checkbox_field_1": {
            "type": "boolean"
        },
        "checkbox_field_2": {
            "type": "boolean"
        },
        "radio_field": {
            "type": "integer"
        },
        "example_text": {
            "type": "string",
            "maxLength": 300,
        },
        "example_input": {
            "type": "string",
            "pattern": "^123", // Starts with 123...
        },
        "example_select": { 
            "type": "string",
            "enum": ["default", "option1", "option2"] 
        }
    }
}

```

```js
// ./schemas/ExampleForm.js
import React from 'react';


// Input hooks (state handling) ...
const inputHook = (spec, context) => {

    if (spec.props.name in context.state) {
        spec.props.value = context.state[spec.props.name];  // Default value
    }

    spec.props.onChange = (event) => {
        context.setState({ [event.target.name]: event.target.value });
    }

}

const checkedInputHook = (spec, context) => {

    if (spec.props.type === 'radio') {
        
        spec.props.checked = (spec.props.name in context.state && context.state[spec.props.name] === spec.props.value);
        
        spec.props.onChange = (event) => {
            context.setState({ [event.target.name]: event.target.value });
        }

    } else if (spec.props.type === 'checkbox') {

        spec.props.checked = (spec.props.name in context.state && context.state[spec.props.name]);

        spec.props.onChange = (event) => {
            context.setState({ [event.target.name]: event.target.checked });
        }

    }

}

const selectOptionsHook = (spec, context) => {
    spec.props.children = Array.from(spec.schema.enum).map(key => <option key={key} value={key}>{key}</option>);
}

export default {
    checkbox_field: {
        group: [
            {
                label: 'Checkbox 0',
                element: 'input',
                props: {
                    name: 'checkbox_field_1',
                    type: 'checkbox',
                }
            },
            {
                label: 'Checkbox 1',
                element: 'input',
                props: {
                    name: 'checkbox_field_2',
                    type: 'checkbox',
                }
            }
        ],
        hooks: [checkedInputHook]
    },
    radio_field: {
        group: [
            {
                label: 'Radio 0',
                element: 'input',
                props: {
                    // name: 'radio_field',
                    type: 'radio',
                    value: 1,
                }
            },
            {
                label: 'Radio 1',
                element: 'input',
                props: {
                    // name: 'radio_field',
                    type: 'radio',
                    value: 2,
                }
            }
        ],
        hooks: [checkedInputHook]
    },
    example_text: {
        label: "Example text",
        element: 'textarea',
        hooks: [stateHook],
    },
    example_input: {
        label: "Example input",
        element: 'input',
        props: {
            type: 'text',
            placeholder: "Example...",
            // ...
        },
        hooks: [inputHook],
    },
    example_select: {
        label: "Select from SSR schema",
        element: 'select',
        props: {
            value: 'default', // Set default
        },
        hooks: [
            inputHook,
            selectOptionsHook,
            (field, context) => {
                field.props.value = field.schema.enum[0]; // Override default ...
                context.setState({[field.props.name]: field.props.value});
            }
        ],
    },
};

```

```js
// Form elements options
interface IFormElementSpec {
    element: React.ElementType; // element or string
    template: React.ElementType; // override default template
    factory: TFormElementFactory; // override element factory
    schema: IFormElementDataSchema;
    props: React.PropsWithChildren<any>;
    hooks: Array<THook>;
    label: string;
    markup: TFormMarkup; // markup vs element
    prefix: TFormMarkup; // before element form group
    suffix: TFormMarkup; // after element form group
    prepend: TFormMarkup; // before input
    append: TFormMarkup; // after input
}
// Form manager context
interface IFormManagerContext {
    state: React.ComponentState;
    setState: React.SetStateAction<React.ComponentState>;
    reducer: React.Reducer<React.ComponentState, React.ReducerAction<any>>;
    dispatch: React.Dispatch<React.ReducerAction<any>>;
}
```

```js
// client
import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router';

import DataContext from './DataContext';
import formSpecs from './schemas/ExampleForm';

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
                    console.log("response body....", data.data);
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
                    <Form specs={formSpecs} schema={this.context.data.schema['properties']} />
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
const Ajv = require('ajv').default

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