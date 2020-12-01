import * as React from "react";

export const node = (element: React.ElementType, props: TElementProps, empty: boolean = false): React.ReactNode => {
    return (element && !("children" in props && !props.children && empty === false)) ? React.createElement(element, props) : null;
}

export function ElementGroupTemplate({ children, spec }: { children: React.ReactChildren, spec: IFormElementSpec }) {
    return (
        <div>
            {children}
        </div>
    );
}

export function InputTemplate({ spec }: { spec: IFormElementSpec }) {
    return (
        <React.Fragment>
            {node("label", { children: spec.label, htmlFor: spec.props.id })}
            {node(spec.prepend, { spec })}
            {React.createElement(spec.element, spec.props)}
            {node(spec.append, { spec })}
        </React.Fragment>
    );
}

export function HtmlTemplate({ spec }: { spec: IFormElementSpec }) {
    return (
        <React.Fragment>
            {node(spec.html, { spec })}
        </React.Fragment>
    );
}