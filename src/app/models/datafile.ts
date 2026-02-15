import {Config} from "./config";
import {Unit} from "./unit";
import {Detachment} from "./detachment";

export class Datafile {
    constructor(
        public config: Config,
        public detachments: Detachment[],
        public units: Unit[]
    ){}
}
