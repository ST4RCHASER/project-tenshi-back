import firebase,{app} from 'firebase-admin';
import { getFirebaseConfig } from './scripts/getFirebaseConfig';
export class Firebase {
    firebaseApp: app.App;
    constructor() {
        this.firebaseApp
    }
    start(): Firebase {
        this.firebaseApp = firebase.initializeApp(getFirebaseConfig());
        return this;
    }
    get(): app.App {
        return this.firebaseApp;
    }
    db(): firebase.database.Database {
        return this.get().database();
    }
    ref(name: string): firebase.database.Reference {
        return this.db().ref(name);
    }
    set(ref: firebase.database.Reference, newData: any) {
        ref.set(newData);
    }
}