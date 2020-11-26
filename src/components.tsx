import * as React from "react";
import { InputTemplate, MarkupTemplate } from "./templates";

// @todo context type
export function FieldComponent({ name, field, context }: { name: string, field: IField, context: any }) {

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

    if (!field.markup && !field.props.onChange && context) {
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
    }

    return (<field.template field={field} />);
}