import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import {
  Box,
  Divider,
  Drawer,
  Stack,
  Typography,
  SvgIcon,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >
            <Logo />
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {/* <SideNavItem
              active={"/" ? (pathname === "/") : false}
              icon={(
                <SvgIcon fontSize="small">
                  <ChartBarIcon />
                </SvgIcon>
              )}
              key="Overview"
              path={"/"}
              title="Overview"
            /> */}
            {items.map((category) => {
              return (
                <Box
                  key={category.title}
                  sx={{
                    '& + &': {
                      mt: 3
                    }
                  }}
                >
                  <Typography
                    color="neutral.500"
                    variant="overline"
                  >
                    {category.title}
                  </Typography>
                  <Stack
                    component="ul"
                    spacing={0.5}
                    sx={{
                      listStyle: 'none',
                      p: 0,
                      m: 0
                    }}
                  >
                    {category.items.map((item) => {
                        const active = item.path ? (pathname === item.path) : false;
          
                        return (
                          <SideNavItem
                            active={active}
                            disabled={item.disabled}
                            external={item.external}
                            icon={item.icon}
                            key={item.title}
                            path={item.path}
                            title={item.title}
                          />
                        );
                      })
                    }
                  </Stack>
                </Box>
              )
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        >
          <Typography
            color="neutral.100"
            variant="subtitle2"
          >
            PGround - 0.1.0
          </Typography>
          <Typography
            color="neutral.500"
            variant="body2"
          >
            This is still in development
          </Typography>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
