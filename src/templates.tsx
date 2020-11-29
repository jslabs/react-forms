import * as React from "react";

export function ElementGroupTemplate({ children, spec }: { children: React.ReactChildren, spec: IFormElementSpec }) {
    return (
        <div>
            {children}
        </div>
    );
}

export function InputTemplate({ spec }: { spec: IFormElementSpec }) {
    const label = (spec.label) ? <label htmlFor={spec.props.id}>{spec.label}</label> : null;
    const prepend = (spec.prepend) ? <spec.prepend spec={spec} /> : null;
    const append = (spec.append) ? <spec.append spec={spec} /> : null;
    return (
        <React.Fragment>
            {label}
            {prepend}
            <spec.element {...spec.props} />
            {append}
        </React.Fragment>
    );
}

export function HtmlTemplate({ spec }: { spec: IFormElementSpec }) {
    return (
        <React.Fragment>
            <spec.html  spec={spec} />
        </React.Fragment>
    );
}