import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Navbar} from "./components/navbar/navbar";
import {Datafiles} from "./services/datafiles/datafiles";
import {Memory} from "./services/memory/memory";
import {Core} from "./models/core";
import {Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Navbar],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly router: Router = inject(Router);
    readonly toastr = inject(ToastrService);

    core!: Core;
    coreSubscription: Subscription;

    updateModal: boolean = false;
    temporaryCore!: Core;

    constructor() {
        this.coreSubscription = this.datafilesService.getCore().subscribe(data => this.core = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.compareDatafiles();
    }

    compareDatafiles(): void {
        if (this.core) {
            this.datafilesService.httpGetCore(this.core.path + 'core.json').subscribe({
                next: (data) => {
                    if(data.enabled) {
                        if (data.version > this.core.version) {
                            this.updateModal = true;
                            this.temporaryCore = data;
                        }
                    }
                }
            });
        }
    }

    setupDatafiles(core: Core) {
        this.datafilesService.setCore(this.temporaryCore);
        this.toastr.success('CORE ADDED');
        this.updateModal = false;

        let books = [];

        core.configs.forEach(config => {
            this.datafilesService.httpGetBook(core.path + config.endpoint).subscribe({
                next: (data) => {
                    books.push(data);
                    this.datafilesService.setBooks(books);
                }
            });
        });
    }
}
