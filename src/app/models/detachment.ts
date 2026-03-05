import {Equipment} from "./unit";

export class Detachment {
    constructor(
        public id: string,
        public type: string,
        public rulesetId: string,
        public name: string,
        public enhancements: Enhancement[],
        public additionalDatasheets: string[],
        public blockedDatasheets?: string[],
        public additionalEquipment?: Equipment[],
        public additionalKeywords?: string[]
    ){}
}

export class Enhancement {
    constructor(
        public name: string,
        public keywordsMustCombined: string[],
        public keywordsMustSeparate: string[],
        public keywordsBlocked: string[],
        public selected: boolean,
        public points: number
    ) {}
}
