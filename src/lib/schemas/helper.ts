import type { Type } from "arktype";
import type { BaseTypeProp } from "arktype/internal/variants/object.ts";

type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : null | T;

export const deepPartial = <T extends Type>(
    t: T,
): Type<DeepPartial<T["inferOut"]>> =>
    (t
        .ifExtends("object")
        ?.map((prop: BaseTypeProp) => ({
            ...prop,
            value: deepPartial(prop.value),
        }))
        .partial() ?? t.or("null")) as Type<DeepPartial<T["inferOut"]>>;
