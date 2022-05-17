import { Feed } from "./feed";
import { MemoryActivityStorage, MemoryTimelineStorage } from "./memory.storage";

export class MemoryFeed extends Feed {
    activityStorage = MemoryActivityStorage.create();
    timelineStorage = MemoryTimelineStorage.create();
}
