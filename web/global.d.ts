declare module '*.css';

type JSONValue = string | number | boolean | { [x: string]: JSONValue } | JSONValue[];

type Nullable<T> = T | null | undefined;
