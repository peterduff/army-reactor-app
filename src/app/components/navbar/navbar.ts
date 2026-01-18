import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroBars3Solid, heroXMarkSolid, heroDocumentTextSolid} from '@ng-icons/heroicons/solid';
import {heroSquare2Stack} from '@ng-icons/heroicons/outline';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-navbar',
    imports: [NgOptimizedImage, NgIcon, RouterLink],
    viewProviders: [provideIcons({heroBars3Solid, heroXMarkSolid, heroDocumentTextSolid, heroSquare2Stack})],
    templateUrl: './navbar.html',
    styleUrl: './navbar.scss',
})
export class Navbar {

    openMenu: boolean = false;

    constructor() {
    }
}
