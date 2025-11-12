export type PaymentStatus = "paid" | "refunded" | "failed" | "pending";
export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

export interface PaymentItem {
  id: string;
  userEmail: string;
  hotelName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string; // ISO date
}

export const payments: PaymentItem[] = [
  { id: "p1", userEmail: "aarav.patel@example.com", hotelName: "Sunrise Residency", amount: 6200, method: "card", status: "paid", date: "2025-10-03" },
  { id: "p2", userEmail: "isha.sharma@example.com", hotelName: "Ocean View Suites", amount: 12500, method: "upi", status: "pending", date: "2025-10-08" },
  { id: "p3", userEmail: "rahul.verma@example.com", hotelName: "City Center Inn", amount: 3000, method: "netbanking", status: "refunded", date: "2025-10-13" },
  { id: "p4", userEmail: "neha.gupta@example.com", hotelName: "Sunrise Residency", amount: 9100, method: "card", status: "paid", date: "2025-10-19" },
  { id: "p5", userEmail: "vikram.singh@example.com", hotelName: "Hillside Retreat", amount: 7400, method: "wallet", status: "failed", date: "2025-10-22" },
  { id: "p6", userEmail: "priya.nair@example.com", hotelName: "Ocean View Suites", amount: 13200, method: "card", status: "paid", date: "2025-10-28" },
  { id: "p7", userEmail: "karan.mehta@example.com", hotelName: "City Center Inn", amount: 5200, method: "upi", status: "pending", date: "2025-11-04" },
  { id: "p8", userEmail: "simran.kaur@example.com", hotelName: "Hillside Retreat", amount: 6400, method: "card", status: "paid", date: "2025-11-07" },
  { id: "p9", userEmail: "rohan.das@example.com", hotelName: "Sunrise Residency", amount: 6800, method: "netbanking", status: "paid", date: "2025-11-12" },
  { id: "p10", userEmail: "ananya.rao@example.com", hotelName: "Ocean View Suites", amount: 11800, method: "card", status: "paid", date: "2025-11-18" }
];
