/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  CircularProgress,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getTemplates } from "@/api/template";

interface Template {
  id: number;
  name: string;
  displayName: string;
  description: string;
  fullMarks: number;
}

interface HeaderProps {
  user: any;
  loading: boolean;
  onLogout: () => void;
}

const Header = ({ user, onLogout, loading }: HeaderProps) => {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElCategories, setAnchorElCategories] =
    useState<null | HTMLElement>(null);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
        // Optionally set a fallback or error state
      }
    };

    fetchTemplates();
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenCategoriesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCategories(event.currentTarget);
  };

  const handleCloseCategoriesMenu = () => {
    setAnchorElCategories(null);
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
    handleCloseUserMenu();
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/category/${categoryName}`);
    handleCloseCategoriesMenu();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Image src="/logo.png" alt="Logo" width={104} height={48} />

          {/* Navigation */}
          <Box sx={{ display: "flex", flexGrow: 1, ml: 4 }}>
            <Button
              component={Link}
              href="/"
              sx={{ color: "inherit", display: "block", mr: 2 }}
            >
              Home
            </Button>

            <Button
              onClick={handleOpenCategoriesMenu}
              sx={{ color: "inherit", display: "block" }}
              endIcon={<ArrowDropDownIcon />}
            >
              Categories
            </Button>
            <Menu
              anchorEl={anchorElCategories}
              open={Boolean(anchorElCategories)}
              onClose={handleCloseCategoriesMenu}
              MenuListProps={{
                "aria-labelledby": "categories-button",
              }}
            >
              {templates.map((template) => (
                <MenuItem
                  key={template.id}
                  onClick={() => handleCategoryClick(template.name)}
                >
                  {template.displayName}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {loading ? (
              <CircularProgress size={24} sx={{ mr: 2 }} />
            ) : user ? (
              <>
                <Tooltip title="Open settings">
                  <Button
                    onClick={handleOpenUserMenu}
                    startIcon={
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    endIcon={<ArrowDropDownIcon />}
                  >
                    {user.username}
                  </Button>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => handleMenuClick("/user/profile")}>
                    <Typography textAlign="center">Your Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick("/user/ratings")}>
                    <Typography textAlign="center">Your Ratings</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick("/item/creating")}>
                    <Typography textAlign="center">
                      Create Rating Item
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick("/account/setting")}>
                    <Typography textAlign="center">Account Settings</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={onLogout}>
                    <Typography textAlign="center">Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                sx={{ my: 1 }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;