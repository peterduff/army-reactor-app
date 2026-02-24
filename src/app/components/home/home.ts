import {Component, inject, OnInit} from '@angular/core';
import {Core} from "../../models/core";
import {Datafiles} from "../../services/datafiles/datafiles";
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroBars3Solid, heroXMarkSolid, heroDocumentTextSolid} from '@ng-icons/heroicons/solid';
import {heroSquare2Stack} from '@ng-icons/heroicons/outline';
import {Router, RouterLink} from '@angular/router';
import {Roster} from "../../models/roster";
import {Memory} from "../../services/memory/memory";
import {ConfigFilterPipe} from "../../pipes/config-filter/config-filter-pipe";
import {RosterFilterPipe} from "../../pipes/roster-filter/roster-filter-pipe";
import * as uuid from "uuid";

@Component({
    selector: 'app-home',
    imports: [NgIcon, RouterLink, ConfigFilterPipe, RosterFilterPipe],
    viewProviders: [provideIcons({heroBars3Solid, heroXMarkSolid, heroDocumentTextSolid, heroSquare2Stack})],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly router: Router = inject(Router);

    core!: Core;
    activeRoster!: Roster ;
    rosters!: Roster[] ;

    deleteId!: string;

    constructor() {
        this.datafilesService.getCore().subscribe(data => this.core = data);
        this.memoryService.getActiveRoster().subscribe(data => this.activeRoster = data);
        this.memoryService.getRosters().subscribe(data => this.rosters = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.memoryService.setRosters(this.memoryService.localGetRosters());
        this.memoryService.setActiveRoster(this.memoryService.localGetActiveRoster());

        if (!this.core) {
            this.router.navigate(['/datafiles']);
            console.log('core missing');
        } else {
            console.log('core found');
        }
    }

    loadRoster(roster: Roster) {
        this.memoryService.setActiveRoster(roster);
        this.router.navigate(['/roster']);
    }

    duplicateRoster(roster: Roster) {
        let duplicatedRoster = new Roster(uuid.v4(), roster.name, roster.rulesetId, roster.detachmentId, roster.units);
        this.rosters.push(duplicatedRoster);
        this.memoryService.setRosters(this.memoryService.cloneObject(this.rosters));
    }

    deleteRoster(uuid: string): void {
        let targetRoster = this.rosters.find(roster => roster.uuid === uuid);
        this.rosters.splice(this.rosters.indexOf(targetRoster!), 1);
        this.memoryService.setRosters(this.memoryService.cloneObject(this.rosters));
        this.deleteId = '';
    }
}
