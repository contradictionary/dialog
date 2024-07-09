type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};
type CreateReadonly<Type> = {
    +readonly [Property in keyof Type]: Type[Property];
};
