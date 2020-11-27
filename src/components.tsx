import * as React from "react";
import { InputTemplate, MarkupTemplate } from "./templates";

// @todo context type
export function FieldComponent({ name, field, context }: { name: string, field: IField, context: IFormManagerContext }) {

    field.props = {
        ...field.props,
        ...{
            'name': name,
            'id': name,
        }
    }

    if (context.state && name in context.state) {
        field.props.value = context.state[name];
    }

    const value = field.props.value;

    if (context && !field.markup && !field.props.onChange) {
        field.props.onChange = (event: React.ChangeEvent<TFormInput>) => {
            context.setState({ [event.target.name]: event.target.value });
        }
    }

    if (!field.template) {
        field.template = (!field.markup) ? InputTemplate : MarkupTemplate;
    }

    if (field.hooks) {
        for (const hook of Array.from(field.hooks)) {
            hook(field, context);
        }
        if (context && value !== field.props.value) {
            context.setState({ [field.props.name]: field.props.value });
        }
    }

    return <field.template field={field} />;
}