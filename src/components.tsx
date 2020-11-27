import * as React from "react";
import { InputTemplate, MarkupTemplate } from "./templates";

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

    if (!field.template) {
        field.template = (!field.markup) ? InputTemplate : MarkupTemplate;
    }

    if (field.hooks) {
        for (const hook of Array.from(field.hooks)) {
            hook(field, context);
        }
    }

    return <field.template field={field} />;
}