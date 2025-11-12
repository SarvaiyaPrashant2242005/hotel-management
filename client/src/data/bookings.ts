export type BookingStatus = "pending" | "approved" | "cancelled";

export interface BookingItem {
  id: string;
  userName: string;
  userEmail: string;
  hotelName: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  amount: number; // revenue
  status: BookingStatus;
}

export const bookings: BookingItem[] = [
  { id: "b1", userName: "Aarav Patel", userEmail: "aarav.patel@example.com", hotelName: "Sunrise Residency", checkIn: "2025-10-01", checkOut: "2025-10-03", amount: 6200, status: "approved" },
  { id: "b2", userName: "Isha Sharma", userEmail: "isha.sharma@example.com", hotelName: "Ocean View Suites", checkIn: "2025-10-05", checkOut: "2025-10-08", amount: 12500, status: "pending" },
  { id: "b3", userName: "Rahul Verma", userEmail: "rahul.verma@example.com", hotelName: "City Center Inn", checkIn: "2025-10-12", checkOut: "2025-10-13", amount: 3000, status: "cancelled" },
  { id: "b4", userName: "Neha Gupta", userEmail: "neha.gupta@example.com", hotelName: "Sunrise Residency", checkIn: "2025-10-16", checkOut: "2025-10-19", amount: 9100, status: "approved" },
  { id: "b5", userName: "Vikram Singh", userEmail: "vikram.singh@example.com", hotelName: "Hillside Retreat", checkIn: "2025-10-20", checkOut: "2025-10-22", amount: 7400, status: "pending" },
  { id: "b6", userName: "Priya Nair", userEmail: "priya.nair@example.com", hotelName: "Ocean View Suites", checkIn: "2025-10-25", checkOut: "2025-10-28", amount: 13200, status: "approved" },
  { id: "b7", userName: "Karan Mehta", userEmail: "karan.mehta@example.com", hotelName: "City Center Inn", checkIn: "2025-11-02", checkOut: "2025-11-04", amount: 5200, status: "pending" },
  { id: "b8", userName: "Simran Kaur", userEmail: "simran.kaur@example.com", hotelName: "Hillside Retreat", checkIn: "2025-11-05", checkOut: "2025-11-07", amount: 6400, status: "approved" },
  { id: "b9", userName: "Rohan Das", userEmail: "rohan.das@example.com", hotelName: "Sunrise Residency", checkIn: "2025-11-10", checkOut: "2025-11-12", amount: 6800, status: "pending" },
  { id: "b10", userName: "Ananya Rao", userEmail: "ananya.rao@example.com", hotelName: "Ocean View Suites", checkIn: "2025-11-15", checkOut: "2025-11-18", amount: 11800, status: "approved" }
];
