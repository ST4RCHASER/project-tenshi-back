import { GameType, GameState, Team } from "../types";
export class Game {
  private id: string
  private name: string
  private stamp: number
  private state: GameState
  private timer: number
  private teams: Team[]
  constructor(id: string) {
    this.id = id;
    return this;
  }

  getType(): GameType {
    switch (this.constructor.name) {
      case "Basketball": return GameType.BASKETBALL
      default: return GameType.UNKNOWN
    }
  }
  getId(): string {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getStamp() {
    return this.stamp;
  }
  getState() {
    return this.state;
  }
  getTimer() {
    return this.timer;
  }
  getTeams() {
    return this.teams;
  }
  setName(newName: string) {
    this.name = newName;
    return this;
  }
  setStamp(newStamp: number) {
    this.stamp = newStamp;
    return this;
  }
  setState(newState: GameState) {
    this.state = newState;
    return this;
  }
  setTimer(newTimer: number) {
    this.timer = newTimer;
    return this;
  }
  setTeams(newTeams: Team[]){
    this.teams = newTeams;
    return this;
  }
  setChildData(newChildData: any) {
    this.setName(newChildData.name);
    this.setStamp(newChildData.stamp);
    this.setState(newChildData.state);
    let teams: Team[] = [];
    for (const ResultTeam of newChildData.teams) {
      let team: Team = {
        name: ResultTeam.name,
        score: ResultTeam.score
      }
      teams.push(team);
    }
    this.setTeams(teams)
    this.setTimer(newChildData.timer)
    switch (this.getType()) {
      case GameType.BASKETBALL:
        (<any>this).setQuarter(newChildData.quarter, false);
        break;
    }
    return this;
  }
  addTeam(newTeam: Team){
    this.teams.push(newTeam);
    return this;
  }
  removeTeam(oldTeam: Team){
    let targetTeam = this.teams.findIndex(x => x == oldTeam);
    if (targetTeam > 0) {
      delete this.teams[targetTeam];
    }
    return this;
  }
  slef() {
    return this;
  }
}