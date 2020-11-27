import * as React from "react";
import FormManager from "./FormManager";
import { FieldComponent } from "./components";

export function Form({ fields, schema }: { fields: IFields, schema: ISchema }) {
    return (
        <FormManager.Consumer>
            {context => {
                return (
                    <React.Fragment>
                        {Object.keys(fields).map(name => {
                            const field = fields[name];
                            field.schema = schema["properties"][name];
                            if (!field.component) {
                                field.component = FieldComponent;
                            }
                            return <field.component key={name} name={name} field={field} context={context} />;
                        })}
                    </React.Fragment>
                );
            }}
        </FormManager.Consumer>
    );
}

export default Form;