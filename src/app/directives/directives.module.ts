import { NgModule } from '@angular/core';
import { ScrollHideDirective } from '../directives/scroll-hide.directive';
@NgModule({
    declarations: [ScrollHideDirective],
    exports: [ScrollHideDirective]
})
export class DirectivesModule {}
