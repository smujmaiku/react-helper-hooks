/*!
 * React Helper Hooks <https://github.com/smujmaiku/react-helper-hooks>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import { useReducer, useEffect, useState } from 'react';
import fetch from 'node-fetch';

export const never = new Promise(() => {});

export function patchReducer(state, patch) {
	if (Object.keys(patch) < 1) return state;
	return {
		...state,
		...patch,
	};
}

/**
 *
 * @param {Object?} init
 * @returns {Array} [state : Object, patch : Function]
 */
export function usePatch(init = {}) {
	return useReducer(patchReducer, init);
}

export function pendingReducer(state, [type, payload]) {
	switch (type) {
	case 'init':
		return {};
	case 'pending':
		if (state.failed) return {};
		return state;
	case 'reject':
		return {
			...state,
			ready: true,
			failed: true,
			error: payload,
		};
	case 'resolve':
		return {
			ready: true,
			data: payload,
		};
	default:
	}
	return state;
}

/**
 * Use pending hook
 * @returns {Array} [state,actions]
 */
export function usePending() {
	const [state, dispatch] = useReducer(pendingReducer, {});
	const [actions] = useState({
		init: () => { dispatch(['init']); },
		pending: () => { dispatch(['pending']); },
		reject: (error) => { dispatch(['reject', error]); },
		resolve: (data) => { dispatch(['resolve', data]); },
	});
	return [state, actions];
}

/**
 * Use pending hook with a promise
 * @param {Promise} promise
 * @returns {Object}
 */
export function usePendingPromise(promise) {
	const [state, { init, resolve, reject }] = usePending();
	const [reload, setReload] = useState(0);

	useEffect(() => {
		init();
		let timeout = false;

		(async () => {
			if (timeout) return;
			const data = await promise();

			if (timeout) return;
			resolve(data);
		})().catch((error) => {
			if (timeout) return;
			reject(error);
		});

		return () => { timeout = true; };
	}, [promise, init, resolve, reject, reload]);

	const actions = {
		reload: () => {
			setReload(Date.now());
		},
	};

	return [state, actions];
}

/**
 * Fetch hook
 * @param {string} url
 * @param {Object} opts
 * @param {string?} opts.bodyType none|buffer|text|json
 */
export function usePendingFetch(url, opts = {}) {
	const [[promise], setPromise] = useState([never]);

	const {
		bodyType = 'none',
		...fetchOpts
	} = opts;
	const fetchOptsStr = JSON.stringify(fetchOpts);

	useEffect(() => {
		setPromise([async () => {
			if (!url) throw new Error('usePendingFetch url undefined');

			const res = await fetch(url, JSON.parse(fetchOptsStr));
			const data = {
				status: res.status,
				headers: res.headers,
			};

			switch (bodyType) {
			case 'buffer':
				data.body = await res.buffer();
				break;
			case 'text':
				data.body = await res.text();
				break;
			case 'json':
				data.body = await res.json();
				break;
			default:
			}

			return data;
		}]);
	}, [url, fetchOptsStr, bodyType]);

	return usePendingPromise(promise);
}

/**
 * Expand a single value to an Array for a hook
 * @param {*} value
 * @returns {Array}
 */
export function useJustOne(value) {
	const [state, setState] = useState([value]);

	useEffect(() => {
		setState([value]);
	}, [value]);

	return state;
}
