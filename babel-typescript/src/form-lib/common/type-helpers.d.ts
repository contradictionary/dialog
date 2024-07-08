export type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};
export type CreateReadonly<Type> = {
    +readonly [Property in keyof Type]: Type[Property];
};
