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

  /* const Link = props => (
  <Text
    {...props}
    accessibilityRole="link"
    style={[styles.link, props.style]}
  />
); */

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
/*
  // material-community
  const materialCommunityFont = require("react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf");
  const materialCommunityFontStyles = `@font-face {
src: url(${materialCommunityFont});
font-family: 'Material Design Icons';
}`;
    style.type = "text/css";
    if (style.styleSheet) {
        style.styleSheet.cssText = materialCommunityFontStyles;
    } else {
        style.appendChild(document.createTextNode(materialCommunityFontStyles));
    }

  // Material Icons
    const materialIconsFont = require("react-native-vector-icons/Fonts/MaterialIcons.ttf");
  const materialIconsFontStyles = `@font-face {
src: url(${materialIconsFont});
font-family: 'Material Icons';
}`;
    style.type = "text/css";
    if (style.styleSheet) {
        style.styleSheet.cssText = materialIconsFontStyles;
    } else {
        style.appendChild(document.createTextNode(materialIconsFontStyles));
    }

  // Octicons
    const octiconsFont = require("react-native-vector-icons/Fonts/Octicons.ttf");
  const octiconsFontStyles = `@font-face {
src: url(${octiconsFont});
font-family: 'Octions';
}`;
    style.type = "text/css";
    if (style.styleSheet) {
        style.styleSheet.cssText = octiconsFontStyles;
    } else {
        style.appendChild(document.createTextNode(octiconsFontStyles));
    }
*/
  document.head.appendChild(style);
};

injectFonts();
