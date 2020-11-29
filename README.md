# @jslabs/react-forms

## Abstract React forms with SSR and AJV JSON Schema support

### Premilinary docs (example)

```js
// server/schemas/example.js
module.exports = {
    "additionalProperties": false,
    "type": "object",
    "properties": {
        "checkbox_field": {
            "type": "array",
            "items": { 
                "type": "integer",
            },
        },
        // "checkbox_field_1": {
        //     "type": "boolean"
        // },
        // "checkbox_field_2": {
        //     "type": "boolean"
        // },
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

        // Named check boxes...
        // spec.props.checked = (spec.props.name in context.state && context.state[spec.props.name]);

        // spec.props.onChange = (event) => {
        //     context.setState({ [event.target.name]: event.target.checked });
        // }

        // Unamed checkboxes...
        let values = (spec.props.name in context.state && context.state[spec.props.name]) ? context.state[spec.props.name] : [];
        spec.props.checked = (values.includes(spec.props.value));

        spec.props.onChange = (event) => {
            values = (event.target.checked) ? [...values, event.target.value] : values.filter(value => (value !== event.target.value));
            context.setState({ [event.target.name]: values });
        }

    }

}

const selectOptionsHook = (spec, context) => {
    spec.props.children = spec.schema.enum.map(key => <option key={key} value={key}>{key}</option>);
}

const ExampleGroupTemplate = ({ children, spec }) => {
    return (
        <fieldset>
            <legend>{spec.data?.legend || spec.label}</legend>
            {children}
        </fieldset>
    );
}

export default {
    checkbox_field: {
        label: "Les checkboxes",
        templates: {
            group: ExampleGroupTemplate,
        },
        group: [
            {
                label: "Checkbox 1",
                element: 'input',
                props: {
                    type: 'checkbox',
                    value: '1',
                }
            },
            {
                label: "Checkbox 2",
                element: 'input',
                props: {
                    type: 'checkbox',
                    value: '2',
                }
            },
            {
                label: "Checkbox 3",
                element: 'input',
                props: {
                    type: 'checkbox',
                    value: '3',
                }
            }
        ],
        hooks: [checkedInputHook]
    },
    radio_field: {
        group: [
            {
                label: "Radio 1",
                element: 'input',
                props: {
                    type: 'radio',
                    value: '1',
                },
                templates: {
                    group: true,  // True (default component) or Component - wrap group elements. (default: false)
                }
            },
            {
                label: "Radio 2",
                element: 'input',
                props: {
                    type: 'radio',
                    value: '2',
                },
                templates: {
                    group: true,
                }
            }
        ],
        templates: {
            group: false,  // Disable default wrapping outside group (default: true)
        },
        hooks: [checkedInputHook]
    },
    example_text: {
        label: "Example text",
        element: 'textarea',
        hooks: [
            inputHook,
            (spec, context) => {
                spec.data = {
                    legend: "Override data hook...",
                }
                spec.append = ({ spec }) => <div>Error...</div>
            }
        ],
        data: {
            legend: "Example data...",
        },
        templates: {
            group: ExampleGroupTemplate,
        },
        append: ({ spec }) => <div>Appended...</div>,
    },
    example_markup: {
        html: ({ spec }) => <pre>Example markup...</pre>,
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
    key: string;
    group: Array<IFormElementSpec>;
    element: React.ElementType;
    factory: TFormElementFactory;
    templates: IFormTemplates;
    schema: IFormElementDataSchema;
    props: React.PropsWithChildren<any>;
    hooks: Array<THook>;
    label: string;
    data: any;
    prepend: React.ElementType;
    append: React.ElementType;
    html: React.ElementType;
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
                    console.log("response...", data.data);
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

    const ajv = new Ajv({ coerceTypes: true })  // Type casting
    const validate = ajv.compile(exampleSchema)
    const valid = validate(body)

    if (valid) {

        // data was validated
    }

    return res.json({
        data: body,
        valid,
        errors: validate.errors || null,
    })
})
```