import CogIcon from '@heroicons/react/24/solid/CogIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import RectangleStack from '@heroicons/react/24/solid/RectangleStackIcon'
import ClipboardDocument from '@heroicons/react/24/solid/ClipboardDocumentIcon'
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon'
import KeyIcon from '@heroicons/react/24/solid/KeyIcon'
import GitHubIcon from '@mui/icons-material/GitHub';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Activity',
    items: [
      {
        title: 'Jobs',
        path: '/jobs',
        icon: (
          <SvgIcon fontSize="small">
            <RectangleStack />
          </SvgIcon>
        )
      },
      {
        title: 'Templates',
        path: '/templates',
        icon: (
          <SvgIcon fontSize="small">
            <ClipboardDocument />
          </SvgIcon>
        )
      },
    ]
  },
  {
    title: 'Projects',
    items: [
      {
        title: 'Repositories',
        path: '/404',
        disabled: true,
        icon: (
          <SvgIcon fontSize="small">
            <GitHubIcon />
          </SvgIcon>
        )
      },
      {
        title: 'Tokens',
        disabled: true,
        path: '/404',
        icon: (
          <SvgIcon fontSize="small">
            <KeyIcon />
          </SvgIcon>
        )
      },
    ]
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Account',
        path: '/account',
        icon: (
          <SvgIcon fontSize="small">
            <UserIcon />
          </SvgIcon>
        )
      },
      {
        title: 'Invite Friends',
        path: '/invites',
        icon: (
          <SvgIcon fontSize="small">
            <UserGroupIcon />
          </SvgIcon>
        )
      },
    ]
  }
]
