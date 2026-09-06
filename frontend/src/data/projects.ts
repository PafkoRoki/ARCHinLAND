import igorImage from '../assets/ProjectCatalog/Igor.png'
import nastjaImage from '../assets/ProjectCatalog/Nastja.png'

export interface Project {
  id: string;
  name: string;
  category: "Nowoczesny" | "Tradycyjny" | "Stodoła" | "Parterowy";

  image: string;

  usableArea: number;
  buildingArea: number;
  residentialArea: number;
  totalArea: number;

  floors: number;
  rooms: number;

  roofType: "Dwuspadowy" | "Czterospadowy" | "Płaski";
  roofAngle: number;

  garage: 0 | 1 | 2;

  plotWidth: number;
  plotLength: number;

  standard: "WT 2021" | "Energooszczędny";
  price: number;
}

export const projects: Project[] = [
  {
    id: "i-001",
    name: "IGOR",
    category: "Nowoczesny",
    image: igorImage,
    usableArea: 90.26,
    buildingArea: 69.91,
    residentialArea: 90.26,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "Dwuspadowy",
    roofAngle: 45,
    garage: 1,
    plotWidth: 20,
    plotLength: 28,
    standard: "WT 2021",
    price: 1000,
  },
  {
    id: "n-001",
    name: "NASTJA",
    category: "Nowoczesny",
    image: nastjaImage,
    usableArea: 93.77,
    buildingArea: 69.91,
    residentialArea: 93.77,
    totalArea: 93.77,
    floors: 2,
    rooms: 3,
    roofType: "Dwuspadowy",
    roofAngle: 30,
    garage: 1,
    plotWidth: 22,
    plotLength: 30,
    standard: "WT 2021",
    price: 1000,
  }
]