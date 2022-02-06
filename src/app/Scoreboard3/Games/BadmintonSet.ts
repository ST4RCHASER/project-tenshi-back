import { Game } from "./Game";
export class BadmintonSet extends Game {
    set: number = 0;
    super(){
    }
    setQuarter(newQuarter: number) {
        this.set = newQuarter;
        return this;
    }
    getQuarter() {
        return this.set;
    }
}