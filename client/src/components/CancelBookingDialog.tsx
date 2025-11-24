import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    _id: string;
    totalPrice: number;
    paymentStatus: string;
    paymentOption?: string;
    advancePayment?: number;
    hotel?: { name: string };
    room?: { roomNumber: string; type: string };
  };
  onConfirm: (bookingId: string, reason: string) => Promise<void>;
  isProcessing?: boolean;
}

const CancelBookingDialog = ({
  open,
  onOpenChange,
  booking,
  onConfirm,
  isProcessing = false,
}: CancelBookingDialogProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = async () => {
    await onConfirm(booking._id, reason);
    setReason("");
  };

  // Calculate refund amount
  const getRefundInfo = () => {
    if (booking.paymentStatus !== "paid") {
      return {
        refundAmount: 0,
        message: "No payment has been made yet.",
      };
    }

    if (booking.paymentOption === "pay-at-hotel") {
      // Only advance payment was made
      const advanceAmount = booking.advancePayment || Math.round(booking.totalPrice * 0.1);
      return {
        refundAmount: advanceAmount,
        message: `Your advance payment of ₹${advanceAmount.toLocaleString()} will be refunded.`,
      };
    }

    // Full payment was made
    return {
      refundAmount: booking.totalPrice,
      message: `Full amount of ₹${booking.totalPrice.toLocaleString()} will be refunded.`,
    };
  };

  const refundInfo = getRefundInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Booking Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Booking Details</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hotel:</span>
                <span className="font-medium">{booking.hotel?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room:</span>
                <span>{booking.room?.type || "N/A"} (#{booking.room?.roomNumber || "N/A"})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold">₹{booking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className="capitalize">{booking.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          {booking.paymentStatus === "paid" && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Refund Information
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {refundInfo.message}
                  </p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    Refund will be processed within 5-7 business days to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          )}

          {booking.paymentStatus === "pending" && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    No payment has been completed for this booking. You can cancel without any charges.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Cancellation (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Please let us know why you're cancelling..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isProcessing}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Cancelling..." : "Cancel Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelBookingDialog;
