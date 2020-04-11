/*!
 * React Helper Hooks <https://github.com/smujmaiku/react-helper-hooks>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import { useReducer, useEffect, useState } from 'react';
import fetch from 'node-fetch';

export const never = new Promise(() => {});

export function rebuildObjectTree(state, list) {
	const newState = { ...state };
	let node = newState;
	for (const key of list) {
		const child = node[key];
		if (child && child instanceof Object && !(child instanceof Array)) {
			node[key] = { ...child };
		} else {
			node[key] = {};
		}
		node = node[key];
	}
	return [newState, node];
}

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

export function helperReducer(state, [type, payload]) {
	switch (type) {
	case 'init':
		return {};
	case 'reset':
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
	case 'patch':
		if (!state.ready || state.failed) return state;
		return {
			...state,
			data: {
				...state.data,
				...payload,
			},
		};
	case 'setIn': {
		if (!state.ready || state.failed) return state;
		const list = ['data', ...payload.key];
		const lastKey = list.pop();
		const [newState, node] = rebuildObjectTree(state, list);
		node[lastKey] = payload.data;
		return newState;
	}
	default:
	}
	return state;
}

/**
 * Use helper reducer
 * @param {*?} initialState
 * @returns {Array} [state, actions]
 */
export function useHelper(initialState) {
	const [state, dispatch] = useReducer(helperReducer, () => {
		if (arguments.length < 1) {
			return helperReducer({}, ['init']);
		} else if (initialState instanceof Error) {
			return helperReducer({}, ['reject', initialState]);
		}
		return helperReducer({}, ['resolve', initialState]);
	});

	const [actions] = useState({
		init: () => { dispatch(['init']); },
		reset: () => { dispatch(['reset']); },
		reject: (error) => { dispatch(['reject', error]); },
		resolve: (data) => { dispatch(['resolve', data]); },
		patch: (data) => { dispatch(['patch', data]); },
		setIn: (key, data) => { dispatch(['setIn', { key, data }]); },
	});

	return [state, actions];
}

/**
 * Promise hook
 * @param {Promise} promise
 * @returns {Array} [state, actions]
 */
export function usePromise(promise) {
	const [state, { init, resolve, reject }] = useHelper();
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

	const [actions] = useState({
		reload: () => {
			setReload(Date.now());
		},
	});

	return [state, actions];
}

/**
 * Fetch hook
 * @param {string} url
 * @param {Object} opts
 * @param {string?} opts.bodyType none|buffer|text|json
 * @returns {Array} [state, actions]
 */
export function useFetch(url, opts = {}) {
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

	return usePromise(promise);
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
