import * as React from "react";
import { InputTemplate, MarkupTemplate } from "./templates";

export function FormElementFactory(spec: IFormElementSpec, context: IFormManagerContext) {

    spec.props = {
        ...{
            'name': spec.key,
            'id': spec.props?.name || spec.key,
        },
        ...spec.props,
    }

    if (!spec.template) {
        spec.template = (!spec.markup) ? InputTemplate : MarkupTemplate;
    }

    if (spec.hooks) {
        for (const hook of spec.hooks) {
            hook(spec, context);
        }
    }

    return <spec.template spec={spec} />;

}

export function FormElementGroupFactory(spec: IFormElementSpec, context: IFormManagerContext) {

    return spec.group.map((element, index) => {

        element.props = {
            ...{
                'name': spec.key,
                'id': (element.props?.name || spec.key) + `_${index}`,
            },
            ...spec.props,
            ...element.props,
        }

        if (!element.template) {
            element.template = (spec.template) ? spec.template : ((!element.markup) ? InputTemplate : MarkupTemplate);
        }

        element.hooks = [...spec.hooks || [], ...element.hooks || []]
        
        if (element.hooks.length) {
            for (const hook of element.hooks) {
                hook(element, context);
            }
        }

        return <element.template key={element.props.id} spec={element} />;

    });

}