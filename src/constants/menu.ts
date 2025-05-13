import { SvgIconComponent } from '@mui/icons-material';
import MovieIcon from '@mui/icons-material/Movie';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TvIcon from '@mui/icons-material/Tv';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

export interface MenuItem {
  name: string;
  displayName: string;
  recommendTitle: string;
  icon: SvgIconComponent | null;
  order: number;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    name: "movie",
    displayName: "Movies",
    recommendTitle: "Hot Movies",
    icon: MovieIcon,
    order: 1
  },
  {
    name: "tv_series",
    displayName: "TV Series",
    recommendTitle: "Popular TV Series",
    icon: TvIcon,
    order: 2
  },
  {
    name: "variety_show",
    displayName: "Variety Show",
    recommendTitle: "Popular Variety Show",
    icon: SlideshowIcon,
    order: 3
  },
  {
    name: "book",
    displayName: "Books",
    recommendTitle: "New Books",
    icon: MenuBookIcon,
    order: 4
  },
  {
    name: "music",
    displayName: "Music",
    recommendTitle: "Popular Music",
    icon: MusicVideoIcon,
    order: 5
  },
  {
    name: "podcast",
    displayName: "Podcasts",
    recommendTitle: "Popular Podcasts",
    icon: HeadsetMicIcon,
    order: 6
  }
]; 