import {
    ActivityId,
    ActivityType,
    FeedType,
    ActivityStorageType,
    TimelineStorageType,
    ObjectId,
} from "./types";
import { selectId } from "./utils";

export abstract class Feed implements FeedType {
    abstract activityStorage: ActivityStorageType;
    abstract timelineStorage: TimelineStorageType;

    constructor(public readonly key: ObjectId) {}

    add(activity: ActivityType) {
        this.addMany([activity]);
    }

    remove(activity: ActivityId) {
        this.removeMany([activity]);
    }

    addMany(activities: ActivityType[]) {
        this.activityStorage.addMany(activities);
        this.timelineStorage.addMany(this.key, activities.map(selectId));
    }

    removeMany(activities: ActivityId[]) {
        this.timelineStorage.removeMany(this.key, activities);
    }

    get(id: number) {
        return this.activityStorage.get(id);
    }

    getMany(count?: number, offset?: number) {
        return this.timelineStorage
            .getMany(this.key, count, offset)
            .map((activity) => this.activityStorage.get(activity))
            .filter(Boolean) as ActivityType[];
    }
}
