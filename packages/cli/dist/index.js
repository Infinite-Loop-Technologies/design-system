#!/usr/bin/env node
import { createRequire } from "node:module";
import React from "react";
import { Box, Text, render, useInput } from "ink";
import { jsx, jsxs } from "react/jsx-runtime";
import "@loop-kit/registry";

//#region rolldown:runtime
var __require = /* @__PURE__ */ createRequire(import.meta.url);

//#endregion
//#region src/app/hooks/useCliState.tsx
const CliStateContext = React.createContext(null);
const initialState = {
	mode: "home",
	status: null
};
function reducer(state, action) {
	switch (action.type) {
		case "SET_MODE": return {
			...state,
			mode: action.mode
		};
		case "SET_STATUS": return {
			...state,
			status: action.status
		};
		default: return state;
	}
}
const CliStateProvider = ({ children }) => {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	return /* @__PURE__ */ jsx(CliStateContext.Provider, {
		value: {
			state,
			dispatch
		},
		children
	});
};
const useCliState = () => {
	const ctx = React.useContext(CliStateContext);
	if (!ctx) throw new Error("useCliState must be used within CliStateProvider");
	return ctx;
};

//#endregion
//#region src/app/screens/HomeScreen.tsx
const HomeScreen = () => /* @__PURE__ */ jsxs(Box, {
	flexDirection: "column",
	padding: 1,
	children: [
		/* @__PURE__ */ jsx(Text, {
			color: "green",
			children: "loop-kit"
		}),
		/* @__PURE__ */ jsx(Text, { children: "Left-hand commands:" }),
		/* @__PURE__ */ jsx(Text, { children: " a – new project (Next + Jazz preset)" }),
		/* @__PURE__ */ jsx(Text, { children: " s – browse registry (shadcn + custom)" }),
		/* @__PURE__ */ jsx(Text, { children: " d – doctor / dry-run checks" }),
		/* @__PURE__ */ jsx(Text, { children: " q – quit" }),
		/* @__PURE__ */ jsx(Text, { children: " z – show this help in status bar" })
	]
});

//#endregion
//#region src/app/screens/RegistryScreen.tsx
const RegistryScreen = () => {
	const { registries, loading, error } = useShadcnRegistry();
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	useInput((_input, key) => {
		if (!registries?.length) return;
		if (key.upArrow || _input === "k") setSelectedIndex((i) => i > 0 ? i - 1 : registries.length - 1);
		else if (key.downArrow || _input === "j") setSelectedIndex((i) => (i + 1) % registries.length);
		else if (key.return || _input === " ") {
			const entry = registries[selectedIndex];
			console.log(`Selected registry: ${entry.name}`);
		}
	});
	if (loading) return /* @__PURE__ */ jsx(Box, {
		padding: 1,
		children: /* @__PURE__ */ jsx(Text, { children: "Loading registries…" })
	});
	if (error) return /* @__PURE__ */ jsx(Box, {
		padding: 1,
		children: /* @__PURE__ */ jsxs(Text, {
			color: "red",
			children: ["Error loading registries: ", error.message]
		})
	});
	if (!registries || registries.length === 0) return /* @__PURE__ */ jsx(Box, {
		padding: 1,
		children: /* @__PURE__ */ jsx(Text, { children: "No registries configured." })
	});
	return /* @__PURE__ */ jsxs(Box, {
		flexDirection: "column",
		padding: 1,
		children: [/* @__PURE__ */ jsx(Text, {
			color: "green",
			children: "Registries"
		}), /* @__PURE__ */ jsx(Box, {
			flexDirection: "column",
			marginTop: 1,
			children: registries.map((entry, idx) => /* @__PURE__ */ jsxs(Text, {
				inverse: idx === selectedIndex,
				color: idx === selectedIndex ? "black" : "white",
				children: [idx === selectedIndex ? "› " : "  ", entry.name]
			}, entry.name))
		})]
	});
};

//#endregion
//#region src/app/screens/InitProjectScreen.tsx
const PRESETS = [
	"next-basic",
	"next-jazz",
	"next-ai-lab"
];
const InitProjectScreen = () => {
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	useInput((input, key) => {
		if (key.upArrow || input === "k") setSelectedIndex((i) => i > 0 ? i - 1 : PRESETS.length - 1);
		else if (key.downArrow || input === "j") setSelectedIndex((i) => (i + 1) % PRESETS.length);
		else if (key.return || input === " ") {
			const preset = PRESETS[selectedIndex];
			console.log(`Init project with preset: ${preset}`);
		}
	});
	return /* @__PURE__ */ jsxs(Box, {
		flexDirection: "column",
		padding: 1,
		children: [
			/* @__PURE__ */ jsx(Text, {
				color: "green",
				children: "New project"
			}),
			/* @__PURE__ */ jsx(Text, { children: "Select a preset:" }),
			PRESETS.map((preset, idx) => /* @__PURE__ */ jsxs(Text, {
				inverse: idx === selectedIndex,
				children: [idx === selectedIndex ? "› " : "  ", preset]
			}, preset))
		]
	});
};

//#endregion
//#region src/app/hooks/useKeyMap.tsx
const useKeymap = () => {
	const { state, dispatch } = useCliState();
	useInput((input, key) => {
		if (input === "q" || key.ctrl && input === "c") process.exit(0);
		if (input === "z") {
			dispatch({
				type: "SET_STATUS",
				status: "Shortcuts: a=init, s=registry, d=doctor, q=quit, arrows/JK=move, enter=select"
			});
			return;
		}
		if (input === "a") {
			dispatch({
				type: "SET_MODE",
				mode: "init"
			});
			dispatch({
				type: "SET_STATUS",
				status: "Init project wizard"
			});
			return;
		}
		if (input === "s") {
			dispatch({
				type: "SET_MODE",
				mode: "registry"
			});
			dispatch({
				type: "SET_STATUS",
				status: "Browsing registry"
			});
			return;
		}
		if (input === "d") {
			dispatch({
				type: "SET_STATUS",
				status: "Running checks (todo)…"
			});
			return;
		}
	});
};

//#endregion
//#region src/app/Root.tsx
const Shell = () => {
	const { state } = useCliState();
	useKeymap();
	let Screen;
	switch (state.mode) {
		case "registry":
			Screen = RegistryScreen;
			break;
		case "init":
			Screen = InitProjectScreen;
			break;
		case "home":
		default: Screen = HomeScreen;
	}
	return /* @__PURE__ */ jsxs(Box, {
		flexDirection: "column",
		borderStyle: "round",
		borderColor: "green",
		children: [/* @__PURE__ */ jsx(Box, {
			flexGrow: 1,
			children: /* @__PURE__ */ jsx(Screen, {})
		}), /* @__PURE__ */ jsx(Box, {
			height: 1,
			paddingX: 1,
			children: /* @__PURE__ */ jsx(Text, {
				color: "gray",
				children: state.status ?? "a: init · s: registry · d: doctor · z: help · q: quit"
			})
		})]
	});
};
const Root = () => {
	return /* @__PURE__ */ jsx(CliStateProvider, { children: /* @__PURE__ */ jsx(Shell, {}) });
};

//#endregion
//#region src/index.tsx
const runCli = () => {
	return render(/* @__PURE__ */ jsx(Root, {}));
};
if (__require.main === module) runCli();

//#endregion
export { runCli };