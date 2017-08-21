
export type PlainObject<T> = {
    [index: string]: T
}

export function uniq<T>(items: T[]) {
    return items.filter((value, index, self) => self.indexOf(value) === index);
}
