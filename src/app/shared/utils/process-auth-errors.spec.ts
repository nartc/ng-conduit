import { processAuthErrors } from './process-auth-errors';

describe(processAuthErrors.name, () => {
  describe('Given no errors', () => {
    describe('When processAuthErrors()', () => {
      it('Then returns empty array and hasError: false', () => {
        const expected = processAuthErrors({});
        expect(expected).toEqual({ errors: [], hasError: false });
      });
    });
  });
});
