export type UserStatus = "active" | "inactive" | "banned";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  registeredAt: string; // ISO date
  status: UserStatus;
}

export const users: UserItem[] = [
  { id: "u1", name: "Aarav Patel", email: "aarav.patel@example.com", registeredAt: "2025-01-05", status: "active" },
  { id: "u2", name: "Isha Sharma", email: "isha.sharma@example.com", registeredAt: "2025-02-12", status: "active" },
  { id: "u3", name: "Rahul Verma", email: "rahul.verma@example.com", registeredAt: "2025-03-28", status: "inactive" },
  { id: "u4", name: "Neha Gupta", email: "neha.gupta@example.com", registeredAt: "2025-04-10", status: "active" },
  { id: "u5", name: "Vikram Singh", email: "vikram.singh@example.com", registeredAt: "2025-05-16", status: "banned" },
  { id: "u6", name: "Priya Nair", email: "priya.nair@example.com", registeredAt: "2025-06-02", status: "active" },
  { id: "u7", name: "Karan Mehta", email: "karan.mehta@example.com", registeredAt: "2025-07-21", status: "inactive" },
  { id: "u8", name: "Simran Kaur", email: "simran.kaur@example.com", registeredAt: "2025-08-09", status: "active" },
  { id: "u9", name: "Rohan Das", email: "rohan.das@example.com", registeredAt: "2025-09-14", status: "active" },
  { id: "u10", name: "Ananya Rao", email: "ananya.rao@example.com", registeredAt: "2025-10-03", status: "inactive" }
];
