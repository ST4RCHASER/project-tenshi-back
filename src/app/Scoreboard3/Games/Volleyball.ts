import { Game } from "./Game";
import { VolleyballSet } from "./VolleyballSet";
export class Volleyball extends Game {
    setsList: VolleyballSet[] = [];
    super() {
    }
    getSetsList() {
        return this.setsList;
    }
    getObjectSetsList() {
        let quarterList = [];
        for (let quarter of this.setsList) {
           try{
               let data = new VolleyballSet(quarter.id).setChildData(quarter).toObject();
            quarterList.push(data);
           }catch(e){
               console.log(e);
           }
        }
        return quarterList;
    }
    setSetsList(newSetsList: VolleyballSet[]) {
        this.setsList = [];
        for(let set of newSetsList){
            this.addQuarter(new VolleyballSet(set.id).setChildData(set));
        }
    }
    addQuarter(newQuarter: VolleyballSet) {
        this.setsList.push(newQuarter);
    }
    getQuarter(quarterNumber: number) {
        return this.setsList[quarterNumber];
    }
}