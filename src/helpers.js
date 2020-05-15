/*!
 * React Helper Hooks <https://github.com/smujmaiku/react-helper-hooks>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import React, { useReducer, useEffect, useState, useCallback, useContext, createContext } from 'react';
import propTypes from 'prop-types';
import fetch from 'node-fetch';

export const never = new Promise(() => {});

/**
 * Use an object in a dependancy
 * @param {*} object
 */
export function useObject(object) {
	const [state, setState] = useState(object);
	const str = JSON.stringify(object);

	useEffect(() => {
		setState(JSON.parse(str));
	}, [str]);

	return state;
}

/**
 * Rebuilds an object's required nodes down a tree path
 * @param {Object} state
 * @param {Array} list
 * @returns {Object} newState
 */
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
	if (!(patch instanceof Object)) return {};
	if (Object.keys(patch) < 1) return state;
	return {
		...state,
		...patch,
	};
}

/**
 * Use simple patch hook
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
	const [state, dispatch] = useReducer(helperReducer, {}, () => {
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
 * Check helpers are ready
 * @param {Array} helpers
 * @returns {Boolean}
 */
export const checkHelpersReady = (helpers) => helpers.every(({ ready }) => ready);

/**
 * Check helpers have failed
 * @param {Array} helpers
 * @returns {Boolean}
 */
export const checkHelpersFailed = (helpers) => helpers.some(({ failed }) => failed);

/**
 * Combine helpers
 * @param {Object} helpers with useMemo
 * @param {Function?} postProcessor with useCallback
 * @returns {Array} [state, actions]
 * @example
 * const [state] = useAllHelpers(
 *   useMemo(() => ({
 *     one, two, three
 *   }), [one, two, three]),
 *   useCallback((data) => {
 *     // Mutate the data
 *     return newData;
 *   }, []),
 * )
 */
export function useAllHelpers(helpers, postProcessor = undefined) {
	const [state, actions] = useHelper();
	const { init, resolve, reject } = actions;

	useEffect(() => {
		const list = Object.values(helpers);
		if (!checkHelpersReady(list)) {
			init();
			return;
		}

		if (checkHelpersFailed(list)) {
			reject();
			return;
		}

		let newState = {};
		Object.entries(helpers).forEach(([key, { data }]) => {
			newState[key] = data;
		});

		if (postProcessor) {
			newState = postProcessor(newState);
		}

		resolve(newState);
	}, [helpers, postProcessor, init, resolve, reject]);

	return [state, actions];
}

/**
 * Promise hook
 * @param {Promise} promise with useCallback
 * @returns {Array} [state, actions]
 * @example
 * const promise = useCallback(async () => {
 *   ...
 * }, []);
 * return usePromise(promise);
 */
export function usePromise(promise) {
	const [state, { init, reset, resolve, reject }] = useHelper();
	const [reload, setReload] = useState(0);
	const [softReload, setSoftReload] = useState(false);

	useEffect(() => {
		if (softReload) {
			reset();
		} else {
			init();
		}
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
	}, [promise, init, resolve, reject, reload, softReload]);

	const [actions] = useState({
		reload: (soft = false) => {
			setSoftReload(soft);
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
	const {
		bodyType = 'none',
		...otherOpts
	} = opts;
	const fetchOpts = useObject(otherOpts);

	const promise = useCallback(async () => {
		if (!url) throw new Error('usePendingFetch url undefined');

		const res = await fetch(url, fetchOpts);
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
	}, [url, fetchOpts, bodyType]);

	return usePromise(promise);
}

/**
 * Make a helper wall to validate loading data
 * @returns {Array} [HelperWall, useHelperWall, context]
 * @example
 * const [Wall, useData] = makeHelperWall();
 * // ...
 * return <Wall state={someHelper}>...</Wall>
 * // ...
 * const [state] = useData();
 */
export function makeHelperWall() {
	const context = createContext();

	function useHelperWall() {
		return useContext(context);
	}

	function HelperWall(props) {
		const {
			children, state, loadingComponent, failedComponent, validate,
		} = props;

		const { ready, failed, data } = state;

		if (!ready) {
			return loadingComponent;
		}

		if (failed || !validate(data)) {
			return failedComponent;
		}

		return (
			<context.Provider value={[data]}>
				{children}
			</context.Provider>
		);
	}

	HelperWall.defaultProps = {
		loadingComponent: false,
		failedComponent: false,
		validate: () => true,
	};

	HelperWall.propTypes = {
		children: propTypes.node.isRequired,
		state: propTypes.object.isRequired,
		loadingComponent: propTypes.node,
		failedComponent: propTypes.node,
		validate: propTypes.func,
	};

	return [HelperWall, useHelperWall, context];
}
