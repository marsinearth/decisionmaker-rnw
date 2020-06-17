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

const injectBody = () => {
  const isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );

  const cssText = `html {
    background-color: #eef4f7;
  } 

  html[data-theme="dark"] {
    background-color: black;
  }
  
  html[data-theme="dark"] .rmc-picker-popup {
    background-color: black;
  }
    
  html[data-theme="dark"] .rmc-picker-mask {
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.6)), linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.6))
  }
  `;

  const style = document.createElement("style");
  style.type = "text/css";
  if (style.styleSheet) {
    style.styleSheet.cssText = cssText;
  } else {
    style.appendChild(document.createTextNode(cssText));
  }
  document.head.appendChild(style);
};

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

injectBody();
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
