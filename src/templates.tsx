import * as React from "react";

export function InputTemplate({ field }: { field: IField }) {
    const label = (field.label) ? <label htmlFor={field.props.id}>{field.label}</label> : null;
    return (
        <React.Fragment>
            {field.prefix}
            <div className="form-group">
                {label}
                {field.prepend}
                <field.element {...field.props} />
                {field.append}
            </div>
            {field.suffix}
        </React.Fragment>
    );
}

export function MarkupTemplate({ field }: { field: IField }) {
    return (
        <React.Fragment>
            {field.prefix}
            {field.markup}
            {field.suffix}
        </React.Fragment>
    );
}