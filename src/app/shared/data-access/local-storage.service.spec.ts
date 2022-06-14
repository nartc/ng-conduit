import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE } from '../di/storage';
import { LocalStorageService } from './local-storage.service';

describe(LocalStorageService.name, () => {
  let service: LocalStorageService;

  describe('Given with local storage', () => {
    let mockedLocalStorage: jasmine.SpyObj<Storage>;

    beforeEach(() => {
      mockedLocalStorage = jasmine.createSpyObj<Storage>('LocalStorage', [
        'getItem',
        'setItem',
        'removeItem',
      ]);

      TestBed.configureTestingModule({
        providers: [
          { provide: LOCAL_STORAGE, useValue: mockedLocalStorage },
          LocalStorageService,
        ],
      });

      service = TestBed.inject(LocalStorageService);
    });

    it('Then create service instance', () => {
      expect(service).toBeTruthy();
    });

    describe('When getItem', () => {
      it('Then call localStorage.getItem', () => {
        service.getItem('item');
        expect(mockedLocalStorage.getItem).toHaveBeenCalledWith('item');
      });

      it('Then return null if there is no item', () => {
        const expected = service.getItem('item');
        expect(expected).toEqual(null);
      });

      it('Then return localStorage.getItem value if there is item', () => {
        mockedLocalStorage.getItem.withArgs('item').and.returnValue('value');
        const expected = service.getItem('item');
        expect(expected).toEqual('value');
      });

      it('Then return localStorage.getItem value as object if item is object', () => {
        const actual = { foo: 'bar' };
        mockedLocalStorage.getItem
          .withArgs('item')
          .and.returnValue(JSON.stringify(actual));

        const expected = service.getItem<{ foo: string }>('item');
        expect(expected).toEqual(actual);
      });
    });

    describe('When setItem', () => {
      it('Then set string item', () => {
        service.setItem('item', 'value');
        expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
          'item',
          'value'
        );
      });

      it('Then call set object item', () => {
        const obj = { foo: 'bar' };
        const stringifiedObj = JSON.stringify(obj);

        service.setItem('item', obj);
        expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
          'item',
          stringifiedObj
        );
      });
    });

    describe('When removeItem', () => {
      it('Then call remove item', () => {
        service.removeItem('item');
        expect(mockedLocalStorage.removeItem).toHaveBeenCalledWith('item');
      });
    });
  });

  describe('Given without local storage', () => {
    beforeEach(() => {
      service = new LocalStorageService(null as unknown as Storage);
    });

    it('Then create service instance', () => {
      expect(service).toBeTruthy();
    });

    it('Then return null for getItem', () => {
      const expected = service.getItem('item');
      expect(expected).toEqual(null);
    });
  });
});
