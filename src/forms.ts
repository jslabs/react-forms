import * as React from "react";

interface IElementTypeMap {
    [key: string]: string;
}

// @todo Default JSON Schema form generator implementation.
export function JsonSchemaForm(schema: IFormDataSchema, state: IFormState, context: React.Context<any>) {

    const STRING_TYPES: IElementTypeMap = {
        "string": "text",
        "email": "email",
        // ...
    };

    const TEXT_AREA_LENGTH = 100;

    const specs: IFormSpec = {};

    for (let key in schema) {

        const schemaSpec = schema[key];

        const spec: IFormElementSpec = {
            key,
            element: 'input',
            props: {},
        };

        if (schemaSpec.type in STRING_TYPES) {

            if (schemaSpec.maxLength >= TEXT_AREA_LENGTH) {
                spec.element = 'textarea';
            } else {
                spec.element = 'input';
                spec.props.type = STRING_TYPES[schemaSpec.type];
            }
        }

        if (key in state) {
            spec.props.value = state[key];
        }

        spec.label = key.replace('_', '');
        spec.label = spec.label.charAt(0).toUpperCase() + spec.label.slice(1);

        specs[key] = spec;

    }

    return specs;

}
