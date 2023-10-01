import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Dashboard from "./Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PersonIcon from "@mui/icons-material/Person";
import MovieIcon from "@mui/icons-material/Movie";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Grid, Paper, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import AddMovie from "./AddMovie";
import WriteReview from "./WriteReview";
import Bookings from "./Bookings";
// import "../App.css";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
    backgroundColor: "rgba(231, 232, 238, 0.8)",
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
    backgroundColor: "rgba(231, 232, 238, 0.8)",
  }),
}));

export default function Sidebar({ page }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [menuData, setMenuData] = React.useState(page);
  const [token, setToken] = useState(sessionStorage.getItem("userToken"));
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [userRole, setUserRole] = useState(sessionStorage.getItem("role"));
  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const [name, setName] = useState(sessionStorage.getItem("name"));
  // console.log("Movie", sessionStorage.getItem("name"));
  const [contentHeight, setContentHeight] = useState("100vh");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (userRole !== "Admin" && userRole !== "Customer")) {
      alert("Access denied");
      navigate("/login");
    } else {
      const mainContent = document.getElementById("main-content");
      if (mainContent.scrollHeight > mainContent.clientHeight) {
        setContentHeight(`${mainContent.scrollHeight}px`);
      } else {
        setContentHeight("100vh");
      }
    }
  }, [menuData, token, userRole, navigate]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Paper
        elevation={24}
        sx={{ backgroundColor: "rgba(231, 232, 238, 0.5)" }}
      >
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "rgba(114, 90, 101, 0.95)",
            backdropFilter: "blur(5px)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Awesome Movies
            </Typography>

            <Box sx={{ marginLeft: "auto" }}>
              {userRole === "Admin" ? (
                <Typography variant="subtitle1">
                  <Button
                    variant="outlined"
                    sx={{ color: "#fff", borderColor: "#fff" }}
                  >
                    Admin
                  </Button>
                </Typography>
              ) : (
                <Typography variant="subtitle1">
                  <Button
                    variant="outlined"
                    sx={{ color: "#fff", borderColor: "#fff" }}
                  >
                    Customer
                  </Button>
                </Typography>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          open={open}
          elevation={24}
          sx={{ backgroundColor: "rgba(231, 232, 238, 0.5)" }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {(userRole === "Admin" || userRole === "Customer") && (
              <ListItem
                key={1}
                disablePadding
                sx={{
                  display: "block",
                  my: 2,
                  backgroundColor: menuData === "Dashboard" && "#725A65",
                }}
                onClick={() => {
                  if (menuData === "Dashboard") {
                    window.location.reload();
                  } else setMenuData("Dashboard");
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title="Dashboard" arrow>
                      <DashboardIcon
                        sx={{
                          color: menuData === "Dashboard" ? "#FFF" : "#725A65",
                        }}
                      />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    sx={{
                      opacity: open ? 1 : 0,
                      color: menuData === "Dashboard" ? "#FFF" : "#725A65",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {userRole === "Admin" && (
              <ListItem
                key={2}
                disablePadding
                sx={{
                  display: "block",
                  mb: 2,
                  backgroundColor: menuData === "AddMovie" && "#725A65",
                }}
                onClick={() => setMenuData("AddMovie")}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title="Add Movie">
                      <MovieIcon
                        sx={{
                          color: menuData === "AddMovie" ? "#FFF" : "#725A65",
                        }}
                      />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary="Add Movie"
                    sx={{
                      opacity: open ? 1 : 0,
                      color: menuData === "AddMovie" ? "#FFF" : "#725A65",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            {userRole === "Customer" && (
              <>
                <ListItem
                  key={21}
                  disablePadding
                  sx={{
                    display: "block",
                    mb: 2,
                    backgroundColor: menuData === "Bookings" && "#725A65",
                  }}
                  onClick={() => setMenuData("Bookings")}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="view Tickets">
                        <BookOnlineIcon
                          sx={{
                            color: menuData === "Bookings" ? "#FFF" : "#725A65",
                          }}
                        />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary="Booked Tickets"
                      sx={{
                        opacity: open ? 1 : 0,
                        color: menuData === "Bookings" ? "#FFF" : "#725A65",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem
                  key={3}
                  disablePadding
                  sx={{
                    display: "block",
                    mb: 2,
                    backgroundColor: menuData === "WriteReview" && "#725A65",
                  }}
                  onClick={() => setMenuData("WriteReview")}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Write Review">
                        <RateReviewIcon
                          sx={{
                            color:
                              menuData === "WriteReview" ? "#FFF" : "#725A65",
                          }}
                        />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary="Write Review"
                      sx={{
                        opacity: open ? 1 : 0,
                        color: menuData === "WriteReview" ? "#FFF" : "#725A65",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {(userRole === "Customer" || userRole === "Admin") && (
              <>
                <ListItem
                  key={4}
                  disablePadding
                  sx={{
                    display: "block",
                    mb: 2,
                    backgroundColor: menuData === "Profile" && "#725A65",
                  }}
                  onClick={() => setMenuData("Profile")}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Profile">
                        <PersonIcon
                          sx={{
                            color: menuData === "Profile" ? "#FFF" : "#725A65",
                          }}
                        />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile"
                      sx={{
                        opacity: open ? 1 : 0,
                        ccolor: menuData === "Profile" ? "#FFF" : "#725A65",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem
                  key={5}
                  disablePadding
                  sx={{ display: "block", mb: 2 }}
                  onClick={() => {
                    sessionStorage.clear();
                    navigate("/login");
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Logout">
                        <LogoutIcon sx={{ color: "#725A65" }} />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      sx={{ opacity: open ? 1 : 0, color: "#725A65" }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
          <Divider />
        </Drawer>
      </Paper>
      <Box
        component="main"
        sx={{ flexGrow: 1, overflow: "auto" }}
        id="main-content"
      >
        {/* <DrawerHeader /> */}
        {menuData === "Dashboard" && (
          <Grid>
            <Dashboard
              token={token}
              username={username}
              userId={userId}
              role={userRole}
              name={name}
            />
          </Grid>
        )}
        {menuData === "Profile" && (
          <Grid>
            <Profile
              token={token}
              username={username}
              userId={userId}
              role={userRole}
            />
          </Grid>
        )}
        {menuData === "AddMovie" && (
          <Grid>
            <AddMovie
              token={token}
              username={username}
              userId={userId}
              role={userRole}
            />
          </Grid>
        )}
        {menuData === "WriteReview" && (
          <Grid>
            <WriteReview
              token={token}
              username={username}
              userId={userId}
              role={userRole}
            />
          </Grid>
        )}
        {menuData === "Bookings" && (
          <Grid>
            <Bookings
              token={token}
              username={username}
              userId={userId}
              role={userRole}
            />
          </Grid>
        )}
      </Box>
    </Box>
  );
}
