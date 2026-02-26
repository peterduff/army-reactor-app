import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Navbar} from "./components/navbar/navbar";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Navbar],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App implements OnInit {
    readonly router: Router = inject(Router);


    constructor() {
    }

    ngOnInit() {
    }
}
