import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { DataService } from './services/data.service';
import { Globals } from './services/global';
import { UtilityService } from './services/utility.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: []
})

export class SharedProviderModule {
  public static forRoot(): ModuleWithProviders<SharedProviderModule> {
    return {
      ngModule: SharedProviderModule,
      providers: [
        DataService,
        UtilityService,
        Globals,
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: SharedProviderModule) {
    if (parentModule) {
      throw new Error('SharedModule is already loaded. Import it in the AppModule only');
    }
  }
}
