import {Component, inject, OnInit} from '@angular/core';
import {Core} from "../../models/core";
import {Subscription} from "rxjs";
import {Datafiles} from "../../services/datafiles/datafiles";
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroBars3Solid, heroXMarkSolid, heroDocumentTextSolid} from '@ng-icons/heroicons/solid';
import {heroSquare2Stack} from '@ng-icons/heroicons/outline';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [
        NgIcon
    ],
    viewProviders: [provideIcons({heroBars3Solid, heroXMarkSolid, heroDocumentTextSolid, heroSquare2Stack})],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home implements OnInit {
    readonly datafilesService = inject(Datafiles)
    readonly router: Router = inject(Router);

    core: Core | undefined;
    coreSubscription: Subscription;

    constructor() {
        this.coreSubscription = this.datafilesService.getCore().subscribe(data => this.core = data);
    }

    ngOnInit() {
        // let core: Core = JSON.parse(localStorage.getItem('core')!);
        //
        // if (!core) {
        //     this.router.navigate(['/datafiles']);
        //     console.log('core missing');
        // } else {
        //     this.datafilesService.setCore(core);
        //     console.log('core found');
        // }
    }
}
