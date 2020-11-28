import * as React from "react";

export function InputGroupTemplate({ spec, children }: { spec: IFormElementSpec, children: React.ReactNode }) {
    // @todo
    return (
        <React.Fragment>
            {spec.prefix}
            <div>
                {children}
            </div>
            {spec.suffix}
        </React.Fragment>
    );
}

export function InputTemplate({ spec }: { spec: IFormElementSpec }) {
    const label = (spec.label) ? <label htmlFor={spec.props.id}>{spec.label}</label> : null;
    // @todo
    return (
        <InputGroupTemplate spec={spec}>
            <React.Fragment>
                {label}
                {spec.prepend}
                <spec.element {...spec.props} />
                {spec.append}
            </React.Fragment>
        </InputGroupTemplate>
    );
}

export function MarkupTemplate({ spec }: { spec: IFormElementSpec }) {
    return (
        <React.Fragment>
            {spec.prefix}
            {spec.markup}
            {spec.suffix}
        </React.Fragment>
    );
}