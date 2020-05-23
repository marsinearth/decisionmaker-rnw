import App from "./components/App";
import GitHubForkRibbon from "react-github-fork-ribbon";
import React from "react";
import ReactDOM from "react-dom";
import { register } from "./serviceWorker";

const ForkRibbon = () => (
  <GitHubForkRibbon
    position="right"
    color="black"
    href="//github.com/marsinearth/decisionmaker-rnw"
    target="_blank"
  >
    <b style={{ fontFamily: "Eczar" }}>Go To Source Code</b>
  </GitHubForkRibbon>
);

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

const AppStart = () => {
  ReactDOM.render(
    <>
      <ForkRibbon />
      <App />
    </>,
    document.getElementById("root")
  );
};

if (!("serviceWorker" in navigator)) {
  AppStart();
}

register();

export default AppStart;
