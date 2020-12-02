# @jslabs/react-forms

## Abstract React forms with JSON Schema support (Ajv) including server-side validation and form generation support

### Premilinary docs (examples)

### Ajv JSON Schema
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

### Build a form directly from a Json Schema
```js
// @todo Default JSON Schema form generator implementation.
function formFromJsonSchema(schema, state, context) {

    const STRING_TYPES = {
        "string": "text",
        "email": "email",
        // ...
    };

    const TEXT_AREA_LENGTH = 100;

    const fields = {};

    for (let key in schema) {

        const schemaField = schema[key];

        const field = {
            element: 'input',
            props: {},
        };

        if (schemaField.type in STRING_TYPES) {

            if (schemaField.maxLength >= TEXT_AREA_LENGTH) {
                field.element = 'textarea';
            } else {
                field.element = 'input';
                field.props.type = STRING_TYPES[schemaField.type];
            }
        }

        if (key in state) {
            field.props.value = state[key];
        }

        field.label = key.replace('_', '');
        field.label = field.label.charAt(0).toUpperCase() + field.label.slice(1);

        fields[key] = field;

    }

    return fields;

}
```

### Full power of an abstract form spec with hooks.
```js
// ./schemas/ExampleForm.js
import React from 'react';

const inputHook = ({ props }, context) => {

    // Default value
    if (props.name in context.state) {
        props.value = context.state[props.name];
    } else if ('value' in props) {
        context.state[props.name] = props.value;
    }

    props.onChange = (event) => {
        context.setState({ [event.target.name]: event.target.value });
    }

}

const checkedInputHook = ({ props }, context) => {

    if (props.type === 'radio') {

        props.checked = (props.name in context.state && context.state[props.name] === props.value);

        props.onChange = (event) => {
            context.setState({ [event.target.name]: event.target.value });
        }

    } else if (props.type === 'checkbox') {

        let values = (props.name in context.state && context.state[props.name]) ? context.state[props.name] : [];
        props.checked = (values.includes(props.value));

        props.onChange = (event) => {
            values = (event.target.checked) ? [...values, event.target.value] : values.filter(value => (value !== event.target.value));
            context.setState({ [event.target.name]: values });
        }

    }

}

const selectOptionsHook = ({ props, schema }, context) => {
    props.children = schema.enum.map(key => <option key={key} value={key}>{key}</option>);
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
    example_widget: {
        label: "Reducer widget...",
        templates: {
            group: ExampleGroupTemplate,
        },
        group: [
            {
                element: 'button',
                props: {
                    type: 'button',
                    children: 'Decrease',
                },
                hooks: [
                    ({ props }, context) => {
                        props.onClick = (event) => {
                            context.dispatch({ type: 'decrease' })
                        }
                    }
                ]
            },
            {
                element: 'input',
                props: {
                    name: 'example_widget_count',
                    type: 'number',
                    value: 0,
                },
                hooks: [
                    ({ props }, context) => {
                        // Default value
                        if (!(props.name in context.state)) {
                            context.state[props.name] = props.value;
                        } else {
                            props.value = context.state[props.name];
                        }
                        props.onChange = (event) => {
                            // handled by reducer...
                        }
                    }
                ],
            },
            {
                element: 'button',
                props: {
                    type: 'button',
                    children: 'Increase',
                },
                hooks: [
                    ({ props }, context) => {
                        props.onClick = (event) => {
                            context.dispatch({ type: 'increase' })
                        }
                    }
                ]
            },
        ],
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

### Example form component implementation
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
        this.reducer = this.reducer.bind(this);
    }

    reducerAction(state, action) {
        switch (action.type) {
          case 'increase':
            return { ...state, example_widget_count: state.example_widget_count + 1 };
          case 'decrease':
            return { ...state, example_widget_count: state.example_widget_count - 1 };
          default:
            return state;
        }
    }

    reducer(action) {
        this.setState(this.reducerAction(this.state, action));
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
                    this.setState(data.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        
        // Generated form from a JSON Schema.
        // const formSchema = formFromJsonSchema(this.context.data.schema['properties'], this.state, this.context);

        const dispatch = (action) => {
            this.reducer(action);
        }
        return (
            <form method="POST" action={this.props.location.pathname} onSubmit={this.submitHandler}>
                <h3>Profile settings</h3>
                <FormManager.Provider value={{ state: this.state, setState: this.stateHandler, reducer: this.reducer, dispatch }}>
                    <Form specs={formSchema} schema={this.context.data.schema['properties']} />
                </FormManager.Provider>
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default withRouter(ExampleForm);

```

### Example server side schema serving and form validation
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