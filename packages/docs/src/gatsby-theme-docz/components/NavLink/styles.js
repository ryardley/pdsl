export const link = {
  my: 2,
  display: "block",
  color: "sidebar.navGroup",
  textDecoration: "none",
  fontSize: 1,
  "&.active": {
    color: "sidebar.navLinkActive"
  }
};

export const smallLink = {
  ...link,
  ml: 3,
  fontSize: 1,
  position: "relative",
  color: "sidebar.tocLink",
  "&.active": {
    color: "sidebar.tocLinkActive"
  },
  "&.active::before": {
    content: '""',
    position: "absolute",
    display: "block",
    top: "2px",
    left: "-10px",
    height: "1.3rem",
    backgroundColor: "primary",
    transition: "width 200ms ease 0s",
    width: "3px",
    borderRadius: 1
  }
};
