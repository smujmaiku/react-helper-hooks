describe('helpers', () => {
	const {
		helperReducer,
	} = require('./helpers');

	describe('helperReducer', () => {
		describe('setIn', () => {
			it('should set inside the data', () => {
				const state1 = { ready: true };

				const state2 = helperReducer(state1, ['setIn', {
					key: ['a', 'b'],
					data: 1,
				}]);
				expect(state2).not.toBe(state1);
				expect(state2.data).not.toBe(state1.data);
				expect(state2.data).toEqual({ a: { b: 1 } });

				const state3 = helperReducer(state2, ['setIn', {
					key: ['a', 'c'],
					data: 2,
				}]);
				expect(state3).not.toBe(state2);
				expect(state3.data).not.toBe(state2.data);
				expect(state3.data.a).not.toBe(state2.data.a);
				expect(state3.data).toEqual({ a: { b: 1, c: 2 } });

				const state4 = helperReducer(state3, ['setIn', {
					key: ['d'],
					data: 3,
				}]);
				expect(state4).not.toBe(state3);
				expect(state4.data).not.toBe(state3.data);
				expect(state4.data.a).toBe(state3.data.a);
				expect(state4.data).toEqual({ a: { b: 1, c: 2 }, d: 3 });
			});

			it('should do nothing', () => {
				const state1 = {};
				expect(helperReducer(state1, ['setIn', {
					key: ['a'],
					data: 1,
				}])).toBe(state1);

				const state2 = { ready: true, failed: true };
				expect(helperReducer(state2, ['setIn', {
					key: ['a'],
					data: 1,
				}])).toBe(state2);
			});
		});
	});
});
