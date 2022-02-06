import { Basketball, FootBall } from ".";
import { GameType, GameState, Team, Score, TimerState } from "../types";
import { BasketballQuarter } from "./BasketballQuarter";
export class Game {
  public id: string
  private name: string = 'Unknown event'
  private stamp: number = new Date().getTime();
  private state: GameState = GameState.NOT_START
  private timer: number = 0;
  private teams: Team[]
  private timerState: TimerState = TimerState.STOPED;
  constructor(id: string) {
    this.id = id;
    return this;
  }

  getType(): GameType {
    switch (this.constructor.name) {
      case "Basketball": return GameType.BASKETBALL
      case "FootBall": return GameType.FOOTBALL
      case "BasketballQuarter": return GameType.BASKETBALL_QUARTER
      case "Volleyball": return GameType.VOLLEYBALL
      case "VolleyballSet": return GameType.VOLLEYBALL_SET
      case "Petanque": return GameType.PETANQUE
      case "Muzzle": return GameType.MUZZLE
      case "MuzzleSet": return GameType.MUZZLE_SET
      case "Badminton": return GameType.BADMINTON
      case "BadmintonSet": return GameType.BADMINTON_SET
      default: return GameType.UNKNOWN
    }
  }
  toObject(): Score {
    let gameMeta = {} as any;
    try { //Basketball & BasketballQuarter
      gameMeta.quarters = (<any>this)?.getObjectQuarterList();
    } catch (e) {
    }
    try { //Game has sets
      gameMeta.sets = (<any>this)?.getObjectSetsList();
    } catch (e) {
    }
    try { //FootBall
      gameMeta.part = (<any>this)?.getPart();
      gameMeta.countdown = (<any>this)?.getCountdownTimer();
      gameMeta.enable_countdown = (<any>this)?.isCountingDown();
    } catch (e) { }
    return {
      id: this.id,
      gameType: this.getType(),
      name: this.getName(),
      stamp: this.getStamp(),
      state: this.getState(),
      teams: this.getTeams(),
      timer: this.getTimer(),
      gameMeta: gameMeta,
      timerState: this.timerState
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
  setTimerState(timerState: TimerState) {
    this.timerState = timerState;
    return this;
  }
  setChildData(newChildData: any) {
    // if (!newChildData.name || !newChildData.stamp || !newChildData.state || !newChildData.timer || !newChildData.teams) return this;
    this.setName(newChildData.name);
    this.setStamp(newChildData.stamp);
    this.setState(newChildData.state);
    this.setTimer(newChildData.timer);
    this.setTimerState(newChildData.timerState);
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
    try {
      if (newChildData.gameMeta) {
        ((<any>this) as any)?.setSetsList(newChildData.gameMeta.sets);
      }
    }catch(e){}
    switch (this.getType()) {
      case GameType.BASKETBALL_QUARTER:
        if (newChildData.gameMeta) {
          ((<any>this) as BasketballQuarter)?.setQuarter(newChildData.quarter);
        }
        break;
      case GameType.BASKETBALL:
        if (newChildData.gameMeta) {
          ((<any>this) as Basketball)?.setQuarterList(newChildData.gameMeta.quarters);
        }
        let team_a_score = 0;
        let team_b_score = 0;
        for (const qscore of (<any>this).getQuarterList()) {
          team_a_score += qscore.getTeams()[0].score;
          team_b_score += qscore.getTeams()[1].score;
        }
        this.getTeams()[0].score = team_a_score;
        this.getTeams()[1].score = team_b_score;
        break;
      case GameType.FOOTBALL:
        if (newChildData.gameMeta) {
          ((<any>this) as FootBall)?.setPart(newChildData.gameMeta.part);
          ((<any>this) as FootBall)?.setCountdownTimer(newChildData.gameMeta.countdown);
          ((<any>this) as FootBall)?.setCountdown(newChildData.gameMeta.enable_countdown);
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
  update() {
    switch (this.getType()) {
      case GameType.BASKETBALL:
        for (const basquarter of (<any>this).quarterList) {
          let basQuarter: BasketballQuarter = basquarter;
          basQuarter.update();
        }
        break;
      default:
        try{
          for (const set of (<any>this).setsList) {
            set.update();
          }
        } catch(e){}
        break;
    }
    switch (this.timerState) {
      case TimerState.COUNTING_DOWN:
        if (this.timer > 0) this.timer--;
        break;
      case TimerState.COUNTING_UP:
        this.timer++;
        break;
    }
    return this;
  }
}