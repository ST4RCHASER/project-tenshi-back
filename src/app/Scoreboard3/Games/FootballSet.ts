import { FootballSetRound } from "./FootballSetRound";
import { Game } from "./Game";
export class FootballSet extends Game {
    setsList: FootballSetRound[] = [];
    super() {
    }
    getSetsList() {
        return this.setsList;
    }
    getObjectSetsList() {
        let quarterList = [];
        for (let quarter of this.setsList) {
           try{
               let data = new FootballSetRound(quarter.id).setChildData(quarter).toObject();
            quarterList.push(data);
           }catch(e){
               console.log(e);
           }
        }
        return quarterList;
    }
    setSetsList(newSetsList: FootballSetRound[]) {
        this.setsList = [];
        for(let set of newSetsList){
            this.addQuarter(new FootballSetRound(set.id).setChildData(set));
        }
    }
    addQuarter(newQuarter: FootballSetRound) {
        this.setsList.push(newQuarter);
    }
    getQuarter(quarterNumber: number) {
        return this.setsList[quarterNumber];
    }
}