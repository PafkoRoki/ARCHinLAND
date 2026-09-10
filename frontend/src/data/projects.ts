import IgorImage1 from '../assets/ProjectCatalog/Igor1.jpg'
import BorysImage1 from '../assets/ProjectCatalog/Borys1.jpg'
import DorotaImage1 from '../assets/ProjectCatalog/Dorota1.jpg'
import nastjaImage1 from '../assets/ProjectCatalog/Nastja1.jpg'
import ErykImage1 from '../assets/ProjectCatalog/Eryk1.jpg'
import ErykImage2 from '../assets/ProjectCatalog/Eryk2.jpg'
import ErykImage3 from '../assets/ProjectCatalog/Eryk3.jpg'
import ErykImage4 from '../assets/ProjectCatalog/Eryk4.jpg'
import ErykImage5 from '../assets/ProjectCatalog/Eryk5.jpg'
import ErykImage6 from '../assets/ProjectCatalog/Eryk6.jpg'
import ErykImage7 from '../assets/ProjectCatalog/Eryk7.jpg'
import ErykImage8 from '../assets/ProjectCatalog/Eryk8.jpg'
import ErykImage9 from '../assets/ProjectCatalog/Eryk9.jpg'
import ErykImage10 from '../assets/ProjectCatalog/Eryk10.jpg'
import ErykImage11 from '../assets/ProjectCatalog/Eryk11.jpg'
import DarekImage1 from '../assets/ProjectCatalog/Darek1.jpg'

export interface Project {
  id: string;
  name: string;
  slug: string;
  category: "do 70m²" | "Tradycyjny" | "Stodoła" | "Parterowy" | "Strzecha";

  image: string;

  usableArea: number;
  buildingArea: number;
  residentialArea: number;
  totalArea: number;

  floors: number | "Antresola";
  rooms: number;

  roofType: "▲" | "◆" | "▬";
  roofAngle: number;

  garage: 0 | 1 | 2;

  plotWidth: number;
  plotLength: number;

  standard: "WT 2021" | "Energooszczędny";

  description?: string;

  gallery: {
    visualizations: string[];
    floorPlans: string[];
    elevations: string[];
  };

  // Pełny URL embed ze Sketchfaba (przycisk "Embed" -> skopiuj src z iframe),
  // np. "https://sketchfab.com/models/<UID>/embed". Opcjonalne.
  sketchfabUrl?: string;
}

export const projects: Project[] = [
  {
    id: "e-001",
    name: "ERYK",
    slug: "eryk",
    category: "do 70m²",
    image: ErykImage1,
    usableArea: 90.26,
    buildingArea: 69.91,
    residentialArea: 90.26,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "▬",
    roofAngle: 5,
    garage: 0,
    plotWidth: 20,
    plotLength: 28,
    standard: "WT 2021",
    sketchfabUrl: "https://sketchfab.com/models/f031c0e298f74d72bffa57cc8f346c1b/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark",
    gallery: {
      visualizations: [ErykImage1,ErykImage6],
      floorPlans: [ErykImage2,ErykImage3,ErykImage4,ErykImage5,ErykImage7],
      elevations: [ErykImage8,ErykImage9,ErykImage10,ErykImage11],
    },
  },
  
  {
    id: "i-001",
    name: "IGOR z garażem",
    slug: "igor-z-garazem",
    category: "do 70m²",
    image: IgorImage1,
    usableArea: 93.77,
    buildingArea: 69.91,
    residentialArea: 93.77,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "▲",
    roofAngle: 45,
    garage: 1,
    plotWidth: 22,
    plotLength: 30,
    standard: "WT 2021",
    sketchfabUrl: "https://sketchfab.com/models/ee3ad68e9bd242ea980e04a0d437ad9d/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark",
    gallery: {
      visualizations: [IgorImage1],
      floorPlans: [],
      elevations: [],
    },
  },

  {
    id: "b-001",
    name: "BORYS",
    slug: "borys",
    category: "do 70m²",
    image: BorysImage1,
    usableArea: 90.26,
    buildingArea: 69.91,
    residentialArea: 90.26,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "▲",
    roofAngle: 40,
    garage: 0,
    plotWidth: 20,
    plotLength: 28,
    standard: "WT 2021",
    sketchfabUrl: "https://sketchfab.com/models/9e883bdfbe40405c83b9cdb525972faf/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark",
    gallery: {
      visualizations: [BorysImage1],
      floorPlans: [],
      elevations: [],
    },
  },
  
  {
    id: "n-001",
    name: "NASTJA z garażem",
    slug: "nastja-z-garazem",
    category: "do 70m²",
    image: nastjaImage1,
    usableArea: 93.77,
    buildingArea: 69.91,
    residentialArea: 93.77,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "▲",
    roofAngle: 30,
    garage: 1,
    plotWidth: 22,
    plotLength: 30,
    standard: "WT 2021",
    sketchfabUrl: "https://sketchfab.com/models/070bb56b3d4347e081efe243e89d1506/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark",
    gallery: {
      visualizations: [nastjaImage1],
      floorPlans: [],
      elevations: [],
    },
  },

  {
    id: "d-001",
    name: "DOROTA",
    slug: "dorota",
    category: "Strzecha",
    image: DorotaImage1,
    usableArea: 144.72,
    buildingArea: 81.36,
    residentialArea: 144.72,
    totalArea: 93.77,
    floors: 2,
    rooms: 5,
    roofType: "▲",
    roofAngle: 45,
    garage: 0,
    plotWidth: 20,
    plotLength: 28,
    standard: "WT 2021",
    sketchfabUrl: "https://sketchfab.com/models/3dec385d67934b17b1039550c07298e1/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark",
    gallery: {
      visualizations: [DorotaImage1],
      floorPlans: [],
      elevations: [],
    },
  },
  
  {
    id: "d-002",
    name: "DAREK",
    slug: "darek",
    category: "do 70m²",
    image: DarekImage1,
    usableArea: 91.09,
    buildingArea: 89.60,
    residentialArea: 91.09,
    totalArea: 91.09,
    floors: "Antresola",
    rooms: 3,
    roofType: "▲",
    roofAngle: 35,
    garage: 0,
    plotWidth: 22,
    plotLength: 30,
    standard: "WT 2021",    
    sketchfabUrl: "https://sketchfab.com/models/a5fc11f5aba9452385b4ca74a2b8137b/embed?autostart=0&annotations_visible=0&preload=0&transparent=0&ui_theme=dark",    
    gallery: {
      visualizations: [DarekImage1],
      floorPlans: [],
      elevations: [],
    },
  },

]