import { GameType, GameState, Team, Score } from "../types";
export class Game {
  private id: string
  private name: string = 'Unknown event'
  private stamp: number = new Date().getTime();
  private state: GameState = GameState.NOT_START
  private timer: number = 0;
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
  toObject(): Score {
    let gameMeta = {} as any;
    try {
      gameMeta.quarter = (<any>this)?.getQuarter();
    } catch (e) {
      console.log('Create game meta error:', e)
    }
    return {
      id: this.id,
      gameType: this.getType(),
      name: this.getName(),
      stamp: this.getStamp(),
      state: this.getState(),
      teams: this.getTeams(),
      timer: this.getTimer(),
      gameMeta: gameMeta,
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
  setTeams(newTeams: Team[]) {
    this.teams = newTeams;
    return this;
  }
  setChildData(newChildData: any) {
    // if (!newChildData.name || !newChildData.stamp || !newChildData.state || !newChildData.timer || !newChildData.teams) return this;
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
        if (newChildData.gameMeta) {
          (<any>this)?.setQuarter(newChildData.gameMeta.quarter, false);
        }
        break;
    }
    return this;
  }
  addTeam(newTeam: Team) {
    this.teams.push(newTeam);
    return this;
  }
  removeTeam(oldTeam: Team) {
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