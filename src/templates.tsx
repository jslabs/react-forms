import * as React from "react";

export const node = (element: TElement, props: TElementProps, empty: boolean = false): React.ReactNode => {
    return (element && !("children" in props && !props.children && empty === false)) ? React.createElement(element, props) : null;
}

export function ElementGroupTemplate({ children, spec }: { children: React.ReactChildren, spec: TFormGroupTemplateSpec }) {
    return (
        <div>
            {children}
        </div>
    );
}

export function InputTemplate({ spec }: { spec: TFormElementTemplateSpec }) {
    if (spec.label && !spec.props.id) {
        spec.props.id = ("groupKey" in spec) ? spec.groupKey : spec.key;
    }
    return (
        <React.Fragment>
            {node("label", { children: spec.label, htmlFor: spec.props.id })}
            {node(spec.prepend, { spec })}
            {React.createElement(spec.element, spec.props)}
            {node(spec.append, { spec })}
        </React.Fragment>
    );
}

export function HtmlTemplate({ spec }: { spec: TFormElementTemplateSpec }) {
    return (
        <React.Fragment>
            {node(spec.html, { spec })}
        </React.Fragment>
    );
}