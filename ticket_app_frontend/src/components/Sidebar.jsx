import React, { useState } from "react";
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
import { Grid, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [menuData, setMenuData] = React.useState("Dashboard");
  const [token, setToken] = useState(sessionStorage.getItem("userToken"));
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [userRole, setUserRole] = useState(sessionStorage.getItem("role"));
  const [username, setUsername] = useState(sessionStorage.getItem("username"));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: "#725A65" }}>
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
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
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
              sx={{ display: "block", my: 2 }}
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
                    <DashboardIcon sx={{ color: "#725A65" }} />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={{ opacity: open ? 1 : 0, color: "#725A65" }}
                />
              </ListItemButton>
            </ListItem>
          )}
          {userRole === "Admin" && (
            <ListItem
              key={2}
              disablePadding
              sx={{ display: "block", mb: 2 }}
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
                    <MovieIcon sx={{ color: "#725A65" }} />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary="Add Movie"
                  sx={{ opacity: open ? 1 : 0, color: "#725A65" }}
                />
              </ListItemButton>
            </ListItem>
          )}
          {userRole === "Customer" && (
            <>
              <ListItem
                key={21}
                disablePadding
                sx={{ display: "block", mb: 2 }}
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
                      <BookOnlineIcon sx={{ color: "#725A65" }} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary="Booked Tickets"
                    sx={{ opacity: open ? 1 : 0, color: "#725A65" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem
                key={3}
                disablePadding
                sx={{ display: "block", mb: 2 }}
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
                      <RateReviewIcon sx={{ color: "#725A65" }} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary="Write Review"
                    sx={{ opacity: open ? 1 : 0, color: "#725A65" }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {(userRole === "Customer" || userRole === "Admin") && (
            <ListItem
              key={4}
              disablePadding
              sx={{ display: "block", mb: 2 }}
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
                    <PersonIcon sx={{ color: "#725A65" }} />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary="Profile"
                  sx={{ opacity: open ? 1 : 0, color: "#725A65" }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* <DrawerHeader /> */}
        {menuData === "Dashboard" && (
          <Grid>
            <Dashboard
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