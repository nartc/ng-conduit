import { render } from '@testing-library/angular';
import { ReplaySubject } from 'rxjs';
import { Profile } from './profile.component';
import { ProfileStore, ProfileVm } from './profile.store';

describe(Profile.name, () => {
  let mockedStore: jasmine.SpyObj<ProfileStore>;

  let mockedVm$: ReplaySubject<ProfileVm>;

  async function setup() {
    mockedVm$ = new ReplaySubject(1);

    mockedStore = jasmine.createSpyObj<ProfileStore>(
      ProfileStore.name,
      ['toggleFollow'],
      { vm$: mockedVm$.asObservable() }
    );

    return await render(Profile, {
      componentProviders: [{ provide: ProfileStore, useValue: mockedStore }],
    });
  }

  it('Then create component', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
