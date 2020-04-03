import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { jsx, Styled } from "theme-ui";
import Embed from "react-runkit";
import { usePrismTheme } from "~utils/theme";

export const Code = ({ children, className: outerClassName }) => {
  const [language] = outerClassName
    ? outerClassName.replace(/language-/, "").split(" ")
    : ["text"];
  const theme = usePrismTheme();
  const [o, rerender] = React.useState();
  React.useEffect(() => {
    if (!window.RunKit) {
      setTimeout(() => {
        rerender({});
      }, 100);
    }
  }, [o]);

  if (window.RunKit && language === "js") {
    return (
      <Embed
        gutterStyle="none"
        theme="atom-dark"
        preamble={'var {default:p} = require("pdsl");'}
        source={children.trim()}
      />
    );
  }

  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Styled.pre
          className={`${outerClassName || ""} ${className}`}
          style={{ ...style, overflowX: "auto" }}
          data-testid="code"
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span
                  {...getTokenProps({ token, key })}
                  sx={{ display: "inline-block" }}
                />
              ))}
            </div>
          ))}
        </Styled.pre>
      )}
    </Highlight>
  );
};
