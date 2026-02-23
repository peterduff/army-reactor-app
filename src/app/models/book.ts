import {Config} from "./config";
import {Unit} from "./unit";
import {Detachment} from "./detachment";

export class Book {
    constructor(
        public config: Config,
        public detachments: Detachment[],
        public units: Unit[],
        public alliances?: Alliance[]
    ){}
}

export class Alliance {
    constructor(
        public name: string,
        public units: Unit[]
    ) {
    }
}
