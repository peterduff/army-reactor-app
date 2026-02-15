import {Config} from "./config";

export class Core {
    constructor(
        public id: string,
        public version: string,
        public name: string,
        public updateNotes: string,
        public enabled: boolean,
        public path: string,
        public configs: Config[]
    ) {
    }
}
