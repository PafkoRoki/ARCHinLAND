import IgorImage1 from '../assets/projekty/Igor1.jpg'
import DorotaImage1 from '../assets/projekty/Dorota1.jpg'
import nastjaImage1 from '../assets/projekty/Nastja1.jpg'
import ErykImage1 from '../assets/projekty/Eryk1.jpg'
import ErykImage6 from '../assets/projekty/Eryk6.jpg'
import DarekImage1 from '../assets/projekty/Darek1.jpg'

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

  // ----- Karta projektu (układ jak archi-projekt.com.pl) — wszystko opcjonalne,
  // brakujące pola/sekcje po prostu się nie wyświetlą.

  // Krótka lista pomieszczeń, np. "3 pokoje, łazienka, kuchnia z jadalnią, garderoba"
  roomsSummary?: string;

  // Zestawienie pomieszczeń per kondygnacja (sekcja "Rzuty").
  // plan = obrazek rzutu (np. ErykImage2), extraArea = pow. całkowita w nawiasie.
  floorRooms?: {
    name: string; // "Parter", "Poddasze", "Piętro"...
    plan?: string;
    rooms: { name: string; area: number; extraArea?: number }[];
  }[];

  // Sekcja "Technologia i konstrukcja" (kąt dachu bierze się z roofAngle)
  technology?: {
    walls?: string;          // Ściany
    ceiling?: string;        // Strop
    roofCovering?: string;   // Pokrycie dachu
    roofInsulation?: string; // Ocieplenie poddasza / dachu
    wallInsulation?: string; // Ocieplenie ścian
    plaster?: string;        // Tynk
    foundation?: string;     // Fundamenty
    heating?: string;        // Ogrzewanie
  };

  // Sekcja "Powierzchnie i wymiary" (m², m³, m)
  garageArea?: number;
  boilerRoomArea?: number;
  atticArea?: number;
  terraceArea?: number;
  netArea?: number;
  roofArea?: number;
  heatedVolume?: number;
  buildingHeight?: number;
  eavesHeight?: number;

  // Sekcja "Działka i elewacje": plan zagospodarowania działki (elewacje biorą się z gallery.elevations).
  // Bez obrazka pokazuje się schemat z minimalnymi wymiarami działki.
  plotImage?: string;

  // Szacunkowy koszt stanu surowego [zł]
  rawStateCost?: number;

  gallery: {
    visualizations: string[];
    floorPlans: string[];
    elevations: string[];
  };

  // Pełny URL embed ze Sketchfaba (przycisk "Embed" -> skopiuj src z iframe),
  // np. "https://sketchfab.com/models/<UID>/embed". Opcjonalne.
  sketchfabUrl?: string;

  // URL do PDF z rysunkami (z watermarkiem) do pobrania
  drawingsPdfUrl?: string;
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
      visualizations: [ErykImage1, ErykImage6],
      floorPlans: [
        "/projekty/eryk/rysunki/01.webp",  // Rzut parteru
        "/projekty/eryk/rysunki/03.webp",  // Rzut piętra
        "/projekty/eryk/rysunki/05.webp",  // Rzut dachu
        "/projekty/eryk/rysunki/02.webp",  // Aksonometria parteru
        "/projekty/eryk/rysunki/04.webp",  // Aksonometria piętra
        "/projekty/eryk/rysunki/06.webp",  // Przekrój
        "/projekty/eryk/rysunki/07.webp",  // Aksonometria 3D z przekrojem
      ],
      elevations: [
        "/projekty/eryk/rysunki/08.webp",  // Elewacja 1
        "/projekty/eryk/rysunki/09.webp",  // Elewacja 2
        "/projekty/eryk/rysunki/10.webp",  // Elewacja 3
        "/projekty/eryk/rysunki/11.webp",  // Elewacja 4
        "/projekty/eryk/rysunki/12.webp",  // Aksonometria zewnętrzna
      ],
    },
    drawingsPdfUrl: "/projekty/eryk/Eryk-rysunki.pdf",
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
    garageArea: 24.08,
    boilerRoomArea: 5.74,
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