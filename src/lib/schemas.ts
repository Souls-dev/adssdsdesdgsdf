import { z } from "zod";
import { FARMHOUSE_IDS } from "@/data/farmhouses";

export const BookingSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .trim(),
    contactNumber: z
      .string()
      .regex(
        /^(\+92|0)[0-9]{10}$/,
        "Enter a valid Pakistani phone number (e.g. 03XX-XXXXXXX or +92XXXXXXXXXX)"
      ),
    email: z.string().email("Enter a valid email address"),
    farmhouseId: z.enum(FARMHOUSE_IDS, {
      message: "Please select a farmhouse",
    }),
    checkInDate: z.string().refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(date.getTime()) && date >= today;
      },
      { message: "Check-in date must be today or in the future" }
    ),
    checkOutDate: z.string().refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Enter a valid check-out date" }
    ),
    numberOfGuests: z
      .number()
      .int("Number of guests must be a whole number")
      .min(1, "At least 1 guest is required")
      .max(50, "Maximum 50 guests allowed"),
    specialRequests: z
      .string()
      .max(500, "Special requests must be at most 500 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);
      return checkOut > checkIn;
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["checkOutDate"],
    }
  );

export type BookingFormData = z.infer<typeof BookingSchema>;
