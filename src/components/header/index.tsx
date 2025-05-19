/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Tooltip,
  Divider,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeIcon from '@mui/icons-material/Home';
import { getTemplates } from "@/api/template";
import { MENU_ITEMS } from "@/constants/menu";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Breakpoint for mobile (below medium screens)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates() as Template[];
        setTemplates(data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
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

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
    handleCloseUserMenu();
    if (isMobile) setDrawerOpen(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/category/${categoryName}`);
    if (isMobile) setDrawerOpen(false);
  };

  // Define categories with icons
  const categories = [
    { name: 'Home', displayName: 'Home', path: '/', icon: <HomeIcon /> },
    ...MENU_ITEMS.map((menu) => {
      const template = templates.find(t => t.name === menu.name) || { displayName: menu.displayName };
      return {
        name: menu.name,
        displayName: template.displayName,
        path: `/category/${menu.name}`,
        icon: menu.icon ? <menu.icon /> : null,
      }
    })
  ];

  // Drawer content for mobile
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {categories.map((category) => (
          <ListItem
            key={category.name}
            onClick={() => handleCategoryClick(category.name === 'Home' ? '' : category.name)}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemIcon>{category.icon}</ListItemIcon>
            <ListItemText primary={category.displayName} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Mobile Drawer Toggle and Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <DensityMediumIcon />
              </IconButton>
            )}
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={104} height={48} />
            </Link>
          </Box>

          {/* Navigation */}
          {!isMobile ? (
            // Flat navigation for larger screens
            <Box sx={{ display: 'flex', flexGrow: 1, ml: 4, alignItems: 'center' }}>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  component={Link}
                  href={category.path}
                  startIcon={category.icon}
                  sx={{ color: 'text.primary', mr: 2, textTransform: 'none' }}
                >
                  {category.displayName}
                </Button>
              ))}
            </Box>
          ) : (
            // Drawer for mobile
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              sx={{
                '& .MuiDrawer-paper': {
                  bgcolor: 'white',
                  color: 'text.primary',
                },
              }}
            >
              {drawerContent}
            </Drawer>
          )}

          {/* User Section */}
          <Box sx={{ flexGrow: 0 }}>
            {loading ? (
              <CircularProgress size={24} sx={{ mr: 2 }} />
            ) : user ? (
              <>
                <Tooltip title="Open settings">
                  <Button
                    onClick={handleOpenUserMenu}
                    startIcon={
                      user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt="Avatar"
                          width={isMobile ? 40 : 32}
                          height={isMobile ? 40 : 32}
                          style={{ borderRadius: '50%' }}
                        />
                      ) : (
                        <AccountCircleIcon sx={{ fontSize: isMobile ? 40 : 32 }} />
                      )
                    }
                    endIcon={<ArrowDropDownIcon />}
                    sx={{ textTransform: 'none', color: 'text.primary' }}
                  >
                    <Typography variant="body1">{user.nickname || user.username}</Typography>
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
                  <MenuItem onClick={() => handleMenuClick("/user/ratings")}>
                    <Typography textAlign="center">My Ratings</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick("/item/creating")}>
                    <Typography textAlign="center">Create Rating Item</Typography>
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
                href="/auth/login"
                startIcon={<AccountCircleIcon sx={{ fontSize: isMobile ? 40 : 32 }} />}
                sx={{ textTransform: 'none', color: 'text.primary' }}
              >
                Sign In/Up
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;