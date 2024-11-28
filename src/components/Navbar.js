import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Document Manager
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Navbar;
