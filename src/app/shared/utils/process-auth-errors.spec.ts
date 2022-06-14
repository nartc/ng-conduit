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

  describe('Given errors', () => {
    describe('When processAuthErrors()', () => {
      it('Then return errors array and hasError: true', () => {
        const expected = processAuthErrors({
          email: ['required', 'invalid'],
          password: ['too short'],
        });
        expect(expected).toEqual({
          errors: ['email required', 'email invalid', 'password too short'],
          hasError: true,
        });
      });
    });
  });
});
