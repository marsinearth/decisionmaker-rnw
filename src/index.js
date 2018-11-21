import React from "react"
import ReactDOM from "react-dom"
import GitHubForkRibbon from "react-github-fork-ribbon";
import App from "./components/App"
import registerServiceWorker from "./registerServiceWorker"

const ForkRibbon = () => (
  <GitHubForkRibbon
    position="right"
    color="black"
    href="//github.com/marsinearth/decisionmaker-rnw"
    target="_blank" 
  >
		<b style={{'fontFamily':'Eczar'}}>Go To Source Code</b>
	</GitHubForkRibbon>
)

const Wrapper = () => (
  <>
    <ForkRibbon />
    <App />
  </>
)

ReactDOM.render(<Wrapper />, document.getElementById("root"));
registerServiceWorker();

const injectFonts = () => {
  const style = document.createElement("style");
  // fontAwesome
  const fontAwesomeFont = require("react-native-vector-icons/Fonts/FontAwesome.ttf");
  const fontBungee = require("./assets/fonts/Bungee/Bungee-Regular.ttf");
  const fontEczar = require("./assets/fonts/Eczar/Eczar-SemiBold.ttf");

  const fontAwesomeFontStyles = `@font-face { font-family: 'FontAwesome'; src: url(${fontAwesomeFont}); } 
    @font-face { font-family: 'Bungee'; src: url(${fontBungee}); }
    @font-face { font-family: 'Eczar'; src: url(${fontEczar}); }
  `;
  style.type = "text/css";
  if (style.styleSheet) {
      style.styleSheet.cssText = fontAwesomeFontStyles;
  } else {
      style.appendChild(document.createTextNode(fontAwesomeFontStyles));
  }
  document.head.appendChild(style);
};

injectFonts();
