import {
    ActivityType,
    ActivityStorageType,
    TimelineStorageType,
    ObjectId,
} from "./types";

export class MemoryActivityStorage implements ActivityStorageType {
    private _activities = new Map<ObjectId, ActivityType>();

    addMany(activities: ActivityType[]) {
        activities.forEach((activity) => {
            this._activities.set(activity.id, activity);
        });
    }

    removeMany(activities: ObjectId[]) {
        activities.forEach((activity) => {
            this._activities.delete(activity);
        });
    }

    getMany(activities: ObjectId[]) {
        return activities
            .map((activity) => this._activities.get(activity))
            .filter(Boolean) as ActivityType[];
    }

    get(id: ObjectId) {
        return this._activities.get(id);
    }

    purge(): void {
        this._activities.clear();
    }

    static create() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new MemoryActivityStorage();
        return this._instance;
    }

    private static _instance: MemoryActivityStorage;
}

export class MemoryTimelineStorage implements TimelineStorageType {
    private _timelines = new Map<ObjectId, Set<ObjectId>>();

    private constructor() {
        /** */
    }

    addMany(key: ObjectId, activities: ObjectId[]) {
        const timeline = this._getTimeline(key);

        activities.forEach((activity) => {
            timeline.add(activity);
        });
    }

    removeMany(key: ObjectId, activities: ObjectId[]) {
        const timeline = this._getTimeline(key);

        activities.forEach((activity) => {
            timeline.delete(activity);
        });
    }

    getMany(key: ObjectId, count = 10, offset = 0) {
        const timeline = this._getTimeline(key);

        return Array.from(timeline.values()).slice(offset, offset + count);
    }

    purge(): void {
        this._timelines.clear();
    }

    private _getTimeline(key: ObjectId) {
        let timeline = this._timelines.get(key);

        if (!timeline) {
            timeline = new Set<ObjectId>();
            this._timelines.set(key, timeline);
        }

        return timeline;
    }

    static create() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new MemoryTimelineStorage();
        return this._instance;
    }

    private static _instance: MemoryTimelineStorage;
}
