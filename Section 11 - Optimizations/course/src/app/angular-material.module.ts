import {NgModule} from "@angular/core";

import {
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatToolbarModule,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
} from '@angular/material';

@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule,
    ]
})

export class AngularMaterialModule {}
