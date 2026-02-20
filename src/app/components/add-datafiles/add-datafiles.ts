import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Datafiles} from "../../services/datafiles/datafiles";
import {ToastrService} from "ngx-toastr";
import {Core} from "../../models/core";
import {Router} from '@angular/router';
import {Book} from "../../models/book";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-datafiles',
  imports: [RouterLink],
  templateUrl: './add-datafiles.html',
  styleUrl: './add-datafiles.scss',
})
export class AddDatafiles implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly router: Router = inject(Router);
    readonly platformId = inject(PLATFORM_ID);

    core: Core | undefined;
    coreSubscription: Subscription;

    constructor(readonly toastr: ToastrService) {
        this.coreSubscription = this.datafilesService.getCore().subscribe(data => this.core = data);
    }

    ngOnInit(): void {

    }

    addDatafiles(core: string, coreUrl: string) {
        this.datafilesService.httpGetCore(core ? core : coreUrl).subscribe({
            next: (data) => {
                if(data.enabled) {
                    this.setupCore(data);
                    this.toastr.success(data.name, 'ADDED');
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
