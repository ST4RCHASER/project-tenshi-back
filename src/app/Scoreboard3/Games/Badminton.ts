import { BadmintonSet } from "./BadmintonSet";
import { Game } from "./Game";
export class Badminton extends Game {
    setsList: BadmintonSet[] = [];
    super() {
    }
    getSetsList() {
        return this.setsList;
    }
    getObjectSetsList() {
        let quarterList = [];
        for (let quarter of this.setsList) {
           try{
               let data = new BadmintonSet(quarter.id).setChildData(quarter).toObject();
            quarterList.push(data);
           }catch(e){
               console.log(e);
           }
        }
        return quarterList;
    }
    setSetsList(newSetsList: BadmintonSet[]) {
        this.setsList = [];
        for(let set of newSetsList){
            this.addQuarter(new BadmintonSet(set.id).setChildData(set));
        }
    }
    addQuarter(newQuarter: BadmintonSet) {
        this.setsList.push(newQuarter);
    }
    getQuarter(quarterNumber: number) {
        return this.setsList[quarterNumber];
    }
}