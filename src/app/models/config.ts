export class Config {
    constructor(
        public id: string,
        public type: string,
        public rulesetId: string,
        public name: string,
        public keyword: string,
        public enabled: boolean,
        public endpoint: string,
        public associatedRulesets: string[]
    ) {}
}
