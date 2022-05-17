import { ObjectId } from "./types";

export const objectIdToInt = (str: ObjectId) => {
    return typeof str === "number"
        ? str
        : str.split("").reduce((acc, cur) => acc + cur.charCodeAt(0), 0);
};

export const selectId = <T extends { id: any }>(
    object: T
): T extends { id: infer Id } ? Id : never => object.id;
