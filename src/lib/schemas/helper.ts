import type { Type } from "arktype";

export const deepPartial = <T extends Type>(t: T) =>
    t
        .ifExtends("object")
        ?.map((prop) => ({ ...prop, value: deepPartial(prop.value) }))
        .partial() ?? t.or("null");
