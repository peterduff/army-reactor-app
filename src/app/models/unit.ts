export class Unit {
    constructor(
        public id: string,
        public type: string,
        public rulesetId: string,
        public name: string,
        public keywords: string[],
        public role: string,
        public models: Model[],
        public equipment?: Equipment[],
        public uuid?: string,
        public points?: Points[],
        public blueprints?: Model[]
    ) {
    }
}

export class Equipment {
    constructor(
        public type: string,
        public options: Option[],
        public items: string[],
        public selected: boolean
    ) {
    }
}

export class Option {
    constructor(
        public items: string[],
        public selected: boolean
    ) {
    }
}

export class Points {
    constructor(
        public cost: number,
        public minModels: number,
        public maxModels: number
    ) {
    }
}

export class Model {
    constructor(
        public name: string,
        public min: number,
        public max: number,
        public points?: number,
        public equipment?: Equipment[],
    ) {
    }
}
