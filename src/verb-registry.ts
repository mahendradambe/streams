import { VerbRegistryType, VerbType } from "./types";

export class VerbRegistry implements VerbRegistryType {
    private constructor() {}

    private _verbs = new Map<number, VerbType>();

    register(verb: VerbType): void {
        this._verbs.set(verb.id, verb);
    }

    getById(id: number): VerbType | undefined {
        return this._verbs.get(id);
    }

    static create() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new VerbRegistry();

        return this._instance;
    }

    private static _instance: VerbRegistry;
}
