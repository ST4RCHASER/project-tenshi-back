import { Game } from "./Game";
export class Basketball extends Game {
    quarter: number = 0;
    super(){
    }
    setQuarter(newQuarter: number) {
        this.quarter = newQuarter;
        return this;
    }
    getQuarter() {
        return this.quarter;
    }
}