import {Component, inject, OnInit} from '@angular/core';
import {Core} from "../../models/core";
import {Datafiles} from "../../services/datafiles/datafiles";
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroBars3Solid, heroDocumentTextSolid} from '@ng-icons/heroicons/solid';
import {heroSquare2Stack} from '@ng-icons/heroicons/outline';
import {Router, RouterLink} from '@angular/router';
import {Roster} from "../../models/roster";
import {Memory} from "../../services/memory/memory";
import {ConfigFilterPipe} from "../../pipes/config-filter/config-filter-pipe";
import {RosterFilterPipe} from "../../pipes/roster-filter/roster-filter-pipe";
import * as uuid from "uuid";
import {faSolidEllipsisVertical, faSolidXmark} from "@ng-icons/font-awesome/solid";
import {Calculation} from "../../services/calculation/calculation";
import {ToastrService} from "ngx-toastr";
import {Book} from "../../models/book";

@Component({
    selector: 'app-home',
    imports: [NgIcon, RouterLink, ConfigFilterPipe, RosterFilterPipe],
    viewProviders: [provideIcons({faSolidXmark, heroBars3Solid, heroDocumentTextSolid, heroSquare2Stack, faSolidEllipsisVertical})],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly calculationService = inject(Calculation);
    readonly memoryService = inject(Memory);
    readonly toastr: ToastrService = inject(ToastrService);
    readonly router: Router = inject(Router);

    core!: Core;
    books!: Book[];
    activeRoster!: Roster;
    rosters!: Roster[];

    deleteId!: string;
    renameId!: string;
    updateModal: boolean = false;
    temporaryCore!: Core;

    constructor() {
        this.datafilesService.getCore().subscribe(data => this.core = data);
        this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.memoryService.getActiveRoster().subscribe(data => this.activeRoster = data);
        this.memoryService.getRosters().subscribe(data => this.rosters = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.memoryService.setRosters(this.memoryService.localGetRosters());

        if (!this.core) {
            this.router.navigate(['/datafiles']);
            console.log('core missing');
        } else {
            this.compareDatafiles();
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
        let targetRoster: Roster = this.rosters.find(roster => roster.uuid === uuid)!;
        this.rosters.splice(this.rosters.indexOf(targetRoster!), 1);
        this.memoryService.setRosters(this.memoryService.cloneObject(this.rosters));
        this.deleteId = '';
    }

    renameRoster(uuid: string, newName: string): void {
        let targetRoster: Roster = this.rosters.find(roster => roster.uuid === uuid)!;
        targetRoster.name = newName;
        this.rosters.splice(this.rosters.indexOf(targetRoster!), 0);
        this.memoryService.setRosters(this.memoryService.cloneObject(this.rosters));
        this.renameId = '';
    }

    compareDatafiles(): void {
        if (this.core) {
            this.datafilesService.httpGetCore(this.core.path + 'core.json').subscribe({
                next: (data) => {
                    if(data.enabled) {
                        if (parseInt(data.version, 10) > parseInt(this.core.version, 10)) {
                            this.updateModal = true;
                            this.temporaryCore = data;
                        }
                    }
                }
            });
        }
    }

    updateBooks(core: Core) {
        this.datafilesService.setCore(this.temporaryCore);
        this.toastr.success('CORE ADDED');
        this.updateModal = false;

        this.temporaryCore.configs.forEach(config => {
            this.datafilesService.httpGetBook(core.path + config.endpoint).subscribe({
                next: (data) => {
                    let targetBook: Book = this.books.find(book => book.config.id === data.config.id)!;
                    this.books.splice(this.books.indexOf(targetBook!), 0);
                    this.datafilesService.setBooks(this.books);
                    this.calculationService.updateRosterPoints(data);
                }
            });
        });
    }
}
