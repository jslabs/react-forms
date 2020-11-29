import * as React from "react";
import { InputTemplate, HtmlTemplate, ElementGroupTemplate } from "./templates";

export function FormElementFactory(spec: IFormElementSpec, context: IFormManagerContext) {

    spec.props = {
        ...{
            'name': spec.key,
            'id': spec.props?.name || spec.key,
        },
        ...spec.props,
    }

    if (!spec.templates) {
        spec.templates = { element: null, group: true };
    }

    if (!spec.templates?.element) {
        spec.templates.element = (!spec.html) ? InputTemplate : HtmlTemplate;
    }

    if ((!spec.templates?.group && spec.templates?.group !== false) || spec.templates?.group === true) {
        spec.templates.group = ElementGroupTemplate;
    }

    if (spec.hooks) {
        for (const hook of spec.hooks) {
            hook(spec, context);
        }
    }

    let children = <spec.templates.element key={spec.key} spec={spec} />;

    if (spec.templates?.group) {
        return <spec.templates.group children={children} spec={spec} />;
    }

    return children;

}

export function FormElementGroupFactory(spec: IFormElementSpec, context: IFormManagerContext) {

    if (!spec.templates) {
        spec.templates = { element: null, group: true };
    }

    if ((!spec.templates?.group && spec.templates?.group !== false) || spec.templates?.group === true) {
        spec.templates.group = ElementGroupTemplate;
    }

    let children = spec.group.map((element, index) => {

        element.props = {
            ...{
                'name': spec.key,
                'id': (element.props?.name || spec.key) + `_${index}`,
            },
            ...spec.props,
            ...element.props,
        }

        element.key = element.props.id;

        if (!element.templates) {
            element.templates = { element: null, group: false };
        }

        if (!element.templates?.element) {
            element.templates.element = (spec.templates?.element) ? spec.templates.element : ((!element.html) ? InputTemplate : HtmlTemplate);
        }

        if (element.templates?.group === true) {
            element.templates.group = ElementGroupTemplate;
        }

        element.hooks = [...spec.hooks || [], ...element.hooks || []]

        if (element.hooks.length) {
            for (const hook of element.hooks) {
                hook(element, context);
            }
        }

        let _children = <element.templates.element key={element.key} spec={element} />;

        if (element.templates?.group) {
            return <element.templates.group key={element.key} children={_children} spec={element} />;
        }

        return _children;

    });

    if (spec.templates?.group) {
        return <spec.templates.group children={children} spec={spec} />;
    }

    return children;

}