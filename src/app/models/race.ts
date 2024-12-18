
export enum CrewCoef {
    SOLO,
    DOUBLE
}

export enum DistanceCoef {
    A,
    B,
    C,
}

export class Race
{
    constructor(
        public raceId: number,
        public name: string,
        public N: number,
        public E: CrewCoef,
        public D: DistanceCoef
    ) {}
}