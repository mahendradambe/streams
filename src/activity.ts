import { ActivityType, ObjectType, VerbType } from "./types";
import { objectIdToInt } from "./utils";

export class Activity implements ActivityType {
    public id: number;

    get summary() {
        return `${this.actor.id} ${this.verb.pastTense} ${this.object.id}`;
    }

    constructor(
        public readonly time: number,
        public readonly actor: ObjectType,
        public readonly verb: VerbType,
        public readonly object: ObjectType<Record<string, any>>,
        public readonly target?: ObjectType<Record<string, any>>
    ) {
        this.id = parseInt(
            `${this.verb.id}${objectIdToInt(this.actor.id)}${objectIdToInt(
                this.object.id
            )}`
        );
    }

    toJson() {
        return {
            id: this.id,
            time: this.time,
            actor: this.actor.id,
            verb: this.verb.id,
            object: this.object.id,
            summary: this.summary,
        };
    }
}
