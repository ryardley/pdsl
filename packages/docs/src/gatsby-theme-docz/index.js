import React from "react";
import { theme, useConfig, ComponentsProvider } from "docz";
import { Styled, ThemeProvider } from "theme-ui";

import defaultTheme from "~theme";
import components from "~components";

import github from "typography-theme-github";
import { toTheme } from "@theme-ui/typography";
import { merge } from "lodash/fp";

const typography = toTheme(github);

const Theme = ({ children }) => {
  const config = useConfig();
  console.log({ config });
  return (
    <ThemeProvider theme={config.themeConfig} components={components}>
      <ComponentsProvider components={components}>
        <Styled.root>{children}</Styled.root>
      </ComponentsProvider>
    </ThemeProvider>
  );
};

export default theme(
  merge(
    defaultTheme,
    merge(typography, {
      colors: {
        primary: "rgb(228,0,99)",
        sidebar: {
          navLinkActive: "rgb(228,0,99)"
        }
      },
      fontSizes: [...defaultTheme.fontSizes.map(size => size * 1.2)],
      showDarkModeSwitch: false
    })
  )
)(Theme);

// import React from "react";
// import { theme, useConfig, ComponentsProvider } from "docz";
// import { ThemeProvider } from "theme-ui";
// import baseComponents from "gatsby-theme-docz/src/components";

// const componentsMap = {
//   ...baseComponents
// };

// const Theme = ({ children }) => {
//   const config = useConfig();
//   return (
//     <ThemeProvider theme={config}>
//       <ComponentsProvider components={componentsMap}>
//         {children}
//       </ComponentsProvider>
//     </ThemeProvider>
//   );
// };

// const themeConfig = {
//   colors: {
//     primary: "tomato",
//     secondary: "khaki",
//     gray: "lightslategray"
//   }
// };

// export default theme(themeConfig)(Theme);
