import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {Core} from "../../models/core";
import {Datafile} from "../../models/datafile";

@Injectable({
    providedIn: 'root',
})
export class Datafiles {

    readonly core = new Subject<Core>();
    readonly datafiles = new BehaviorSubject<Datafile[]>([]);

    _datafiles: Datafile[] = [];
    datafilesSubscription: Subscription;
    _core: Core | undefined;
    coreSubscription: Subscription;

    constructor(readonly http: HttpClient) {
        this.datafilesSubscription = this.getDatafiles().subscribe( data => this._datafiles = data);
        this.coreSubscription = this.getCore().subscribe( data => this._core = data);

    }

    setCore(core: Core): void {
        this.core.next(core);
    }

    getCore(): Observable<Core> {
        return this.core.asObservable();
    }

    setDatafiles(datafiles: Datafile[]): void {
        this.datafiles.next(datafiles);
    }

    getDatafiles(): Observable<Datafile[]> {
        return this.datafiles.asObservable();
    }

    httpGetCore(endpoint: string): Observable<Core> {
        return this.http.get<Core>(endpoint);
    }

    httpGetDatafiles(endpoint: string): Observable<Datafile> {
        return this.http.get<Datafile>(endpoint);
    }
}
