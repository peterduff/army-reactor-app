import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Datafiles} from "../../services/datafiles/datafiles";
import {ToastrService} from "ngx-toastr";
import {Core} from "../../models/core";
import {Router} from '@angular/router';
import {Memory} from "../../services/memory/memory";

@Component({
  selector: 'app-add-datafiles',
  imports: [RouterLink],
  templateUrl: './add-datafiles.html',
  styleUrl: './add-datafiles.scss',
})
export class AddDatafiles implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly router: Router = inject(Router);
    readonly memoryService = inject(Memory);
    readonly toastr = inject(ToastrService);

    core: Core | undefined;

    constructor() {
        this.datafilesService.getCore().subscribe(data => this.core = data);
    }

    ngOnInit(): void {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.memoryService.setRosters(this.memoryService.localGetRosters());
        this.memoryService.setActiveRoster(this.memoryService.localGetActiveRoster());
    }

    addDatafiles(core: string, coreUrl: string) {
        this.datafilesService.httpGetCore(core ? core : coreUrl).subscribe({
            next: (data) => {
                if(data.enabled) {
                    this.setupCore(data);
                    this.toastr.success('CORE ADDED');
                    this.router.navigate(['/home']);
                }
            }
        });
    }

    setupCore(core: Core) {
        this.datafilesService.setCore(core);
        this.setupDatafiles(core);
    }

    setupDatafiles(core: Core) {
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
