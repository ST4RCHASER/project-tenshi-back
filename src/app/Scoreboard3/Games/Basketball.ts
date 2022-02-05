import { BasketballQuarter } from "./BasketballQuarter";
import { Game } from "./Game";
export class Basketball extends Game {
    quarterList: BasketballQuarter[] = [];
    super() {
    }
    getQuarterList() {
        return this.quarterList;
    }
    getObjectQuarterList() {
        let quarterList = [];
        for (let quarter of this.quarterList) {
           try{
               let data = new BasketballQuarter(quarter.id).setChildData(quarter).toObject();
            quarterList.push(data);
           }catch(e){
               console.log(e);
           }
        }
        return quarterList;
    }
    setQuarterList(newQuarterList: BasketballQuarter[]) {
        this.quarterList = [];
        for(let quarter of newQuarterList){
            this.addQuarter(new BasketballQuarter(quarter.id).setChildData(quarter));
        }
    }
    addQuarter(newQuarter: BasketballQuarter) {
        this.quarterList.push(newQuarter);
    }
    getQuarter(quarterNumber: number) {
        return this.quarterList[quarterNumber];
    }
}