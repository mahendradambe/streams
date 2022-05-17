import { ActivityType } from "./types";

export const selectId = <T extends { id: any }>(
    object: T
): T extends { id: infer Id } ? Id : never => object.id;

export const selectSummary = (activity: ActivityType) => activity.summary;
