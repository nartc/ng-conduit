import { LocalStorageService } from './local-storage.service';

describe(LocalStorageService.name, () => {
  let service: LocalStorageService;

  describe('with local storage', () => {
    let mockedLocalStorage: jasmine.SpyObj<Storage>;

    beforeEach(() => {
      mockedLocalStorage = jasmine.createSpyObj<Storage>('LocalStorage', [
        'getItem',
        'setItem',
        'removeItem',
      ]);
      service = new LocalStorageService(mockedLocalStorage);
    });

    it('should create service instance', () => {
      expect(service).toBeTruthy();
    });

    describe('getItem', () => {
      it('should call localStorage.getItem', () => {
        service.getItem('item');
        expect(mockedLocalStorage.getItem).toHaveBeenCalledWith('item');
      });

      it('and should return null if there is no item', () => {
        const expected = service.getItem('item');
        expect(expected).toEqual(null);
      });

      it('and should return localStorage.getItem value if there is item', () => {
        mockedLocalStorage.getItem.withArgs('item').and.returnValue('value');
        const expected = service.getItem('item');
        expect(expected).toEqual('value');
      });
    });

    describe('setItem', () => {
      it('should set string item', () => {
        service.setItem('item', 'value');
        expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
          'item',
          'value'
        );
      });

      it('should call set object item', () => {
        const obj = { foo: 'bar' };
        const stringifiedObj = JSON.stringify(obj);

        service.setItem('item', obj);
        expect(mockedLocalStorage.setItem).toHaveBeenCalledWith(
          'item',
          stringifiedObj
        );
      });
    });

    describe('removeItem', () => {
      it('should call remove item', () => {
        service.removeItem('item');
        expect(mockedLocalStorage.removeItem).toHaveBeenCalledWith('item');
      });
    });
  });

  describe('without local storage', () => {
    beforeEach(() => {
      service = new LocalStorageService(null as unknown as Storage);
    });

    it('should create service instance', () => {
      expect(service).toBeTruthy();
    });

    it('should return null for getItem', () => {
      const expected = service.getItem('item');
      expect(expected).toEqual(null);
    });
  });
});
