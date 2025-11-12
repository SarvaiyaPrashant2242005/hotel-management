export type RoomStatus = "available" | "occupied" | "maintenance";

export interface RoomItem {
  id: string;
  hotelId: number;
  roomNumber: string;
  type: string;
  price: number;
  status: RoomStatus;
}

export const rooms: RoomItem[] = [
  { id: "r1", hotelId: 1, roomNumber: "101", type: "Overwater Villa", price: 35000, status: "available" },
  { id: "r2", hotelId: 1, roomNumber: "102", type: "Overwater Villa", price: 35000, status: "occupied" },
  { id: "r3", hotelId: 2, roomNumber: "201", type: "Alpine Cabin", price: 22000, status: "available" },
  { id: "r4", hotelId: 3, roomNumber: "301", type: "Executive Room", price: 18000, status: "maintenance" },
  { id: "r5", hotelId: 4, roomNumber: "401", type: "Pool Villa", price: 16000, status: "available" },
  { id: "r6", hotelId: 5, roomNumber: "501", type: "Historic Room", price: 28000, status: "occupied" },
];
