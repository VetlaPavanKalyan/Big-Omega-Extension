import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import OmegaMenu from "./components/OmegaMenu";
import "./App.scss";

function App() {
	const [state, setState] = useState({
		AppConstants: {
			menuJsPath: "#__next > div > div > div > nav > div > div > div.relative.ml-4.flex.items-center.space-x-4",
			companyTagsContainerJsPath:
				"#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div",
			leaveAReviewHref: "https://su5tvpep9cb.typeform.com/to/XYzBkTXf",
			githubRepoHref: "https://github.com/codedecks-in/Big-Omega-Extension"
		},
		problemSlug: window.location.pathname.split("/")[2],
		isMenuOpen: true,
		theme: document.querySelector("html").dataset.theme
	});

	const themeObserverRef = useRef();

	useEffect(() => {
		// window.addEventListener("api-res", (event) => {
		// 	if (event.detail.contentScriptQuery === "getTours") {
		// 		if (event.detail.status === 200) {
		// 			setState((prevState) => ({ ...prevState, savedScreenContent: event.detail.data }));
		// 		}
		// 	}
		// });

		observeTheme();

		if (state.problemSlug !== "") {
			let interval = setInterval(() => {
				let btns = document.querySelector(state.AppConstants.menuJsPath);
				if (document.body && btns) {
					handleInsertOmegaMenu(btns);
					clearInterval(interval);
				}
			}, 1000);
		}
	}, [state.problemSlug]);

	useEffect(() => {
		handleURLChange();
		window.onurlchange = (event) => {
			// e.g. /problems/flip-string-to-monotone-increasing/
			let problem = window.location.pathname.split("/")[2];
			let theme = document.querySelector("html").dataset.theme;
			setState((prevState) => ({
				...prevState,
				problemSlug: problem,
				theme: theme,
				isMenuOpen: false
			}));
		};
	}, []);

	useEffect(() => {
		let btns = document.querySelector(state.AppConstants.menuJsPath);
		if (document.body && btns) {
			handleInsertOmegaMenu(btns);
		}
	}, [state.theme]);

	const observeTheme = () => {
		if (!themeObserverRef.current) {
			console.log("inside theme observer");
			themeObserverRef.current = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === "attributes") {
						let theme = window.document.querySelector("html").dataset.theme;
						setState((prevState) => ({
							...prevState,
							theme: theme
						}));
					}
				});
			});

			themeObserverRef.current.observe(window.document.querySelector("html"), {
				attributes: true //configure it to listen to attribute changes
			});
		}
	};

	const handleURLChange = () => {
		const hasNativeEvent = Object.keys(window).includes("onurlchange");
		if (!hasNativeEvent) {
			let oldURL = window.location.href;
			setInterval(() => {
				const newURL = window.location.href;
				if (oldURL === newURL) {
					return;
				}
				const urlChangeEvent = new CustomEvent("urlchange", {
					detail: {
						oldURL,
						newURL
					}
				});
				oldURL = newURL;
				dispatchEvent(urlChangeEvent);
			}, 25);
			window.addEventListener("urlchange", (event) => {
				if (typeof onurlchange === "function") {
					window.onurlchange(event);
				}
			});
		}
	};

	const handleInsertOmegaMenu = (menuBtns) => {
		let oldMenus = document.querySelectorAll("#big-omega-menu-wrapper");
		if (oldMenus.length > 0) {
			Array.from(oldMenus).forEach((elem) => elem.remove());
		}

		let dummyElem = document.createElement("div");
		dummyElem.id = "big-omega-menu-wrapper";

		if (menuBtns) {
			menuBtns.appendChild(dummyElem);
			ReactDOM.render(
				<OmegaMenu
					problemSlug={state.problemSlug}
					isMenuOpen={state.isMenuOpen}
					theme={state.theme}
					AppConstants={state.AppConstants}
				/>,
				dummyElem
			);
		}
	};

	// const APICallingLogic = (tourContent) => {
	// 	let reqOptions = {
	// 		method: "DELETE",
	// 		headers: {
	// 			"Content-Type": "application/json"
	// 		}
	// 	};
	// 	window.dispatchEvent(
	// 		new CustomEvent("api-req", {
	// 			detail: {
	// 				contentScriptQuery: "deleteTour",
	// 				reqOptions: reqOptions,
	// 				url: `${process.env.REACT_APP_BASE_URL}/v1/api/tour?token=` + state.token + "&tourId=" + tourContent.id
	// 			}
	// 		})
	// 	);
	// };

	return <div></div>;
}

export default App;
