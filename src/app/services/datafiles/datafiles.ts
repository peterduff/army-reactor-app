import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {Core} from "../../models/core";
import {Book} from "../../models/book";

@Injectable({
    providedIn: 'root',
})
export class Datafiles {

    readonly core = new Subject<Core>();
    readonly books = new BehaviorSubject<Book[]>([]);

    _books: Book[] = [];
    booksSubscription: Subscription;
    _core!: Core;
    coreSubscription: Subscription;

    constructor(readonly http: HttpClient) {
        this.booksSubscription = this.getBooks().subscribe( data => this._books = data);
        this.coreSubscription = this.getCore().subscribe( data => this._core = data);

    }

    setCore(core: Core): void {
        this.core.next(core);
        localStorage.setItem('core', JSON.stringify(core));
    }

    getCore(): Observable<Core> {
        return this.core.asObservable();
    }

    httpGetCore(endpoint: string): Observable<Core> {
        return this.http.get<Core>(endpoint);
    }

    localGetCore(): Core {
        return JSON.parse(localStorage.getItem('core')!);
    }

    setBooks(books: Book[]): void {
        this.books.next(books);
        localStorage.setItem('books', JSON.stringify(books));
    }

    getBooks(): Observable<Book[]> {
        return this.books.asObservable();
    }

    httpGetBook(endpoint: string): Observable<Book> {
        return this.http.get<Book>(endpoint);
    }

    localGetBooks(): Book[] {
        return JSON.parse(localStorage.getItem('books')!);
    }
}
