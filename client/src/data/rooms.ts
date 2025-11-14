export type RoomStatus = "available" | "occupied" | "maintenance";

export interface RoomItem {
  id: string;
  hotelId: number;
  roomNumber: string;
  type: string;
  price: number;
  status: RoomStatus;
  // optional detailed fields for richer room display
  title?: string;
  sizeSqft?: number;
  view?: string;
  bedType?: string;
  bathrooms?: number;
  amenities?: string[];
  mealPlan?: string;
  refundable?: boolean;
  images?: string[];
  dealText?: string;
  taxesAndFees?: number;
  strikePrice?: number;
}

export const rooms: RoomItem[] = [
  {
    id: "r1",
    hotelId: 1,
    roomNumber: "101",
    type: "Overwater Villa",
    price: 35000,
    status: "available",
    title: "Premium Pool View With Balcony",
    sizeSqft: 400,
    view: "Swimming Pool View",
    bedType: "1 King Bed",
    bathrooms: 1,
    amenities: [
      "Air Conditioning",
      "Wi‑Fi",
      "Bathroom",
      "Iron/Board",
      "24-hour Housekeeping",
    ],
    mealPlan: "Breakfast Included",
    refundable: false,
    dealText: "Deal Applied: HOTELONMMT",
    taxesAndFees: 633,
    strikePrice: 40780,
  },
  {
    id: "r2",
    hotelId: 1,
    roomNumber: "102",
    type: "Overwater Villa",
    price: 35207,
    status: "occupied",
    title: "Room with Breakfast",
    sizeSqft: 400,
    view: "Swimming Pool View",
    bedType: "1 King Bed",
    bathrooms: 1,
    amenities: [
      "Early check-in (subject to availability)",
      "Complimentary welcome drink",
      "Breakfast",
      "10% Off on Laundry service",
    ],
    mealPlan: "Breakfast Included",
    refundable: false,
    taxesAndFees: 633,
    strikePrice: 40780,
  },
  {
    id: "r3",
    hotelId: 2,
    roomNumber: "201",
    type: "Alpine Cabin",
    price: 22000,
    status: "available",
    mealPlan: "Breakfast & Lunch/Dinner Included",
  },
  {
    id: "r4",
    hotelId: 3,
    roomNumber: "301",
    type: "Executive Room",
    price: 18000,
    status: "maintenance",
  },
  {
    id: "r5",
    hotelId: 4,
    roomNumber: "401",
    type: "Pool Villa",
    price: 16000,
    status: "available",
  },
  {
    id: "r6",
    hotelId: 5,
    roomNumber: "501",
    type: "Historic Room",
    price: 28000,
    status: "occupied",
  },
];
