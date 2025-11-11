#!/usr/bin/env node
import { useEffect, useState } from "react";
import { Box, Text, render } from "ink";
import { jsx, jsxs } from "react/jsx-runtime";

//#region src/index.tsx
const App = () => {
	const [counter, setCounter] = useState(0);
	useEffect(() => {
		const timer = setInterval(() => {
			setCounter((previousCounter) => previousCounter + 1);
		}, 100);
		return () => {
			clearInterval(timer);
		};
	}, []);
	return /* @__PURE__ */ jsx(Box, {
		height: 4,
		alignItems: "center",
		backgroundColor: "green",
		children: /* @__PURE__ */ jsxs(Text, {
			color: "green",
			children: [counter, " tests passed"]
		})
	});
};
render(/* @__PURE__ */ jsx(App, {}));
/**
* And avoid having to mess with annoying tools by doing that all in here.
* Ideas:
* - Add a system for generating and keeping track of design tokens.
* This could be huge - then have a system for remapping CSS vars somewhere and instead pulling them from the tokens.
* Have a dependency management tool obviously - for now just use shadcn registry. This is the main use case of the CLI!!!
* Then maybe add tools for metaprogramming type stuff - most importantly for scripting infra, toolchains/pipelines, and CI/preview/etc.
* Use SST and/or Nitric. Maybe even lean into local sim - but prompt user to install Docker and walk them through it.
* MAYBE toolchain management, e.g. programmatically using Proto. Or just use shadcn registry namespaces but transform this into being something way more powerful.
* I'm sure there's a programmatically usable toolchain manager. I could always use processes too - might be smart?
*
* IDEA: Something that makes it super easy to integrate any library, or component from a comp lib, etc. automatically, retheming it even.
* Something that lets you sandbox stuff/deps? Or redirect env vars elsewhere (like you can do with CSS vars with this)
* Eventually, add a test runtime thingy that's not the browser - this will be the editor/dev tool.
* It'll be sweet, and super-fast to launch.
* First install shadcn then. Find ez way to mimic API surface - find or create a good CLI args parser.
*/

//#endregion
export {  };