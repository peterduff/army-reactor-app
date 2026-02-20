import {Unit} from "./unit";

export class Roster {
    constructor(
        public uuid: string,
        public name: string,
        public rulesetId: string,
        public detachmentId: string,
        public units: Unit[]
    ){}
}
