import { Game } from "./Game";
export class Basketball extends Game {
    quarter: number
    super(){
        
    }
    setQuarter(newQuarter: number) {
        this.quarter = newQuarter;
        return this;
    }
}