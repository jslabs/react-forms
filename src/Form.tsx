import * as React from "react";
import FormManager from "./FormManager";
import { FormElementFactory, FormElementGroupFactory } from "./elements";

export function Form({ specs, schema }: { specs: IFormSpec, schema: IFormJsonSchema }): React.ReactNode {
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
                            return <React.Fragment key={key}>{spec.factory(spec, context)}</React.Fragment>;
                        })}
                    </React.Fragment>
                );
            }}
        </FormManager.Consumer>
    );
}

export default Form;