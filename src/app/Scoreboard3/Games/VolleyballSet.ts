import { Game } from "./Game";
export class VolleyballSet extends Game {
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