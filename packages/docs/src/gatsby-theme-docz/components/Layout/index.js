/** @jsx jsx */
import { useRef, useState } from "react";
import { jsx, Layout as BaseLayout, Main } from "theme-ui";
import { Global } from "@emotion/core";

import global from "~theme/global";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { MainContainer } from "../MainContainer";
import * as styles from "./styles";
import { Github } from "../Icons";
function TopRight() {
  const position = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "200px",
    height: "200px",
    zIndex: 1,
    textAlign: "right"
  };

  const icon = {
    // margin: "2rem"
    marginRight: "20px",
    marginTop: "20px",
    position: "relative",
    zIndex: 1
  };

  const background = {
    position: "absolute",
    width: "200px",
    height: "200px",
    top: "-120px",
    right: "-120px",
    transform: "rotate(45deg)",
    background: "black"
  };
  return (
    <div style={position}>
      <div style={background}></div>
      <a href="https://github.com/ryardley/pdsl">
        <Github color="white" style={icon} />
      </a>
    </div>
  );
}

export const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const nav = useRef();

  return (
    <BaseLayout sx={{ "& > div": { flex: "1 1 auto" } }} data-testid="layout">
      <Global styles={global} />
      <Main sx={styles.main}>
        <Header onOpen={() => setOpen(s => !s)} />
        <TopRight />
        <div sx={styles.wrapper}>
          <Sidebar
            ref={nav}
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={() => setOpen(false)}
          />
          <MainContainer data-testid="main-container">{children}</MainContainer>
        </div>
      </Main>
    </BaseLayout>
  );
};
