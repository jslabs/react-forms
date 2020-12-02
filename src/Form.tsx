import * as React from "react";
import FormManager from "./FormManager";
import { FormElementFactory, FormElementGroupFactory } from "./elements";

interface FieldMap {
    [key: string]: string;
}

// @todo Default JSON Schema form generator implementation.
function formFromJsonSchema(schema: IFormDataSchema, state: IFormState, context: any) {

    const STRING_TYPES: FieldMap = {
        "string": "text",
        "email": "email",
        // ...
    };

    const TEXT_AREA_LENGTH = 100;

    const specs: TPartialFormSpec = {};

    for (let key in schema) {

        const schemaSpec = schema[key];

        const spec: TPartialElementSpec = {
            key: key,
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

export function Form({ specs, schema }: { specs: IFormSpec, schema: IFormDataSchema }): React.ReactNode {
    return (
        <FormManager.Consumer>
            {context => {
                return (
                    <React.Fragment>
                        {Object.keys(specs).map(key => {
                            const spec = specs[key];
                            spec.key = key;
                            if (schema && key in schema) {
                                spec.schema = schema[key];
                            }
                            if (!spec.factory) {
                                spec.factory = (!spec.group) ? FormElementFactory : FormElementGroupFactory;
                            }
                            return React.createElement(React.Fragment, { key }, spec.factory(spec, context));
                        })}
                    </React.Fragment>
                );
            }}
        </FormManager.Consumer>
    );
}

export default Form;